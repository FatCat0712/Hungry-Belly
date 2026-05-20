# Refresh Token Security — How the Used Flag Catches Token Theft

This document explains the core idea behind session-bound refresh token rotation
and how it detects stolen tokens across three real-world scenarios.

---

## The Core Idea

When a user logs in, the server issues two tokens:

- **Access token (AT)** — short-lived (15 min), used on every API call
- **Refresh token (RT)** — long-lived (7 days), used only to get a new AT when the old one expires

The vulnerability with naive rotation is simple: if an attacker steals a refresh
token and uses it, the server has no way to know. It looks like a normal refresh.

The fix is to treat every refresh token as a **single-use ticket**. The moment it
is consumed, a `used` flag flips to `true` and it is permanently dead. If anyone
presents it again — attacker or user — the server knows a theft occurred. It
immediately kills the session and wipes every token in the chain.

There are only three ways this plays out.

---

## Scenario A — Normal Flow, No Attacker

![Normal Flow, No Attacker](resources/auth/scenario_a.jpg)

Nobody steals anything.

The user logs in and receives an access token and a refresh token (RT₀). Every
15 minutes their access token expires and their client silently calls the refresh
endpoint. The server marks RT₀ as used and issues RT₁. Then RT₁ becomes RT₂,
and so on. The user stays logged in seamlessly, rotating tokens in the background,
until they explicitly log out or the refresh token hits its 7-day expiry.

**Result:** No breach. The user never notices anything. Session ends cleanly on logout.

---

## Scenario B — Attacker Uses the Stolen Token First

![Attacker Uses the Stolen Token First](resources/auth/scenario_b.jpg)

The attacker wins the race — and gets a silent window of access.

The attacker captures RT₀ somehow (intercepted connection, XSS, leaked log) and
uses it before the user's access token has expired. At this point RT₀ is still
`used=false`, the session is valid, everything checks out. The server issues RT₁
to the attacker. The attacker is now quietly authenticated and the server has
logged nothing suspicious.

The trap springs later, automatically. When the user's access token eventually
expires, their client does its routine refresh with their copy of RT₀. The server
looks it up and sees `used=true`. That is impossible in a clean world — a token
can only be consumed once. Someone else must have used it first. The server
immediately kills the session and deletes every token in the family, including RT₁
which the attacker currently holds. Both the user and the attacker get a 401.

The attacker had silent access for as long as it took the user's access token to
expire. That gap is exactly the AT TTL — which is why keeping it short (15 min)
matters. Shorter AT means smaller damage window.

**Result:** Attacker had limited silent access. Both parties locked out. User must re-login.

---

## Scenario C — User Uses the Stolen Token First

![User Uses the Stolen Token First](resources/auth/scenario_c.jpg)

The attacker never gets in — but still causes damage by trying.

Same theft as Scenario B, but this time the user refreshes before the attacker
does. RT₀ becomes `used=true`, RT₁ is issued to the legitimate user, and the user
continues normally. The attacker got a copy of RT₀ but was too slow to use it.

Then the attacker tries their stolen RT₀. The server sees `used=true` and the
alarm fires — the same alarm as Scenario B. The server cannot tell who the real
user is and who the attacker is. The only safe response is to destroy everything.
The session dies and RT₁ — the user's currently live token — gets wiped along
with it. The innocent user loses their active session and is forced to re-login.

This is an intentional false positive. The user re-logs in, which takes seconds.
The alternative — doing nothing — means risking a live attacker session. That
trade-off is not a close call.

**Result:** Attacker never got access. User must re-login as collateral. Session fully contained.

---

## Why This Always Works

The `used` flag creates an inescapable trap regardless of who wins the race.

If the attacker goes first (Scenario B), the user accidentally trips the alarm
when they do their next routine refresh. If the user goes first (Scenario C), the
attacker trips the alarm themselves when they try the stolen token. Either way,
**whoever presents the token second guarantees the alarm fires**.

The server does not need to monitor for suspicious behaviour, track IP addresses,
or detect anomalies. It just enforces a simple rule — every refresh token is a
single-use ticket — and lets that rule do all the work.

---

## The One Number That Controls Damage

The only scenario where real damage occurs is Scenario B, and the damage is
bounded by a single number: the **access token TTL**.

```
Damage window = time between attacker's refresh and user's next routine refresh
              = at most your AT TTL
```

| AT TTL    | Max silent access window |
|-----------|--------------------------|
| 5 min     | 5 minutes                |
| 15 min    | 15 minutes               |
| 1 hour    | 1 hour                   |
| 24 hours  | 24 hours                 |

A 15-minute access token is the standard recommendation for a food delivery app.
Short enough to contain damage. Long enough that a normal order flow completes
without interruption.

---

## Summary

| | Scenario A | Scenario B | Scenario C |
|---|---|---|---|
| Token stolen? | No | Yes | Yes |
| Attacker gets access? | No | Yes (brief) | No |
| Who triggers the alarm? | Nobody | The real user | The attacker |
| Damage window | None | Up to AT TTL | None |
| User experience | Seamless | Must re-login | Must re-login |

---

*Part of the Hungry Belly platform security documentation.*
*Reference: https://github.com/FatCat0712/Hungry-Belly*