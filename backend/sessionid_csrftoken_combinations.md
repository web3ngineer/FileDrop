# Django Default Setting

|Cookie|Secure|HttpOnly|SameSite|Can JS Access?|Sent on Cross-Site POST?|
|------|------|--------|--------|---------------|-------------------------|
|sessionid|❌ False|✅ True|Lax|❌ No|❌ No|
|csrftoken|❌ False|❌ False|Lax|✅ Yes|❌ No (POST blocked)|


# SessionID Cookie Settings in Django

| HttpOnly | Secure | SameSite | Can be Read by JS? | Can be Sent on Cross-Site? | Valid over HTTP? | Use Case |
|----------|--------|----------|---------------------|-----------------------------|------------------|----------|
| ❌ False | ❌ False | Strict | ✅ Yes | ❌ No | ✅ Yes | Local dev, less secure |
| ❌ False | ❌ False | Lax | ✅ Yes | ❌ No (POST etc) | ✅ Yes | SPA + API same-origin |
| ❌ False | ❌ False | None | ✅ Yes | ❌ Will be blocked! | ❌ No | ❌ Bad config for cross-site |
| ❌ False | ✅ True | Strict | ✅ Yes | ❌ No | ❌ No (on HTTP) | Works only on HTTPS |
| ❌ False | ✅ True | Lax | ✅ Yes | ❌ No | ❌ No | Good for HTTPS SPA/API |
| ❌ False | ✅ True | None | ✅ Yes | ✅ Yes | ❌ No | Session over HTTPS + cross-origin |
| ✅ True | ❌ False | Strict | ❌ No | ❌ No | ✅ Yes | Safer dev config |
| ✅ True | ❌ False | Lax | ❌ No | ❌ No | ✅ Yes | Dev same-origin API sessions |
| ✅ True | ❌ False | None | ❌ No | ❌ Will be blocked! | ❌ No | ❌ Invalid session config |
| ✅ True | ✅ True | Strict | ❌ No | ❌ No | ❌ No | Best for secure same-origin |
| ✅ True | ✅ True | Lax | ❌ No | ❌ No | ❌ No | Secure SPA/API on HTTPS |
| ✅ True | ✅ True | None | ❌ No | ✅ Yes | ❌ No | Secure cross-origin sessions |





# CSRF Cookie Settings in Django

| HttpOnly | Secure | SameSite | Can be Read by JS? | Can be Sent on Cross-Site? | Valid over HTTP? | Use Case |
|----------|--------|----------|---------------------|-----------------------------|------------------|----------|
| ❌ False | ❌ False | Strict | ✅ Yes | ❌ No | ✅ Yes | Local dev with same-origin only |
| ❌ False | ❌ False | Lax | ✅ Yes | ❌ No (POST etc) | ✅ Yes | Local dev: SPA + API same-origin |
| ❌ False | ❌ False | None | ✅ Yes | ❌ Will be blocked! | ❌ No | ❌ Browser will reject this |
| ❌ False | ✅ True | Strict | ✅ Yes | ❌ No | ❌ No (on HTTP) | Use only on HTTPS in production |
| ❌ False | ✅ True | Lax | ✅ Yes | ❌ No | ❌ No | Good for SPA + API under same origin (HTTPS) |
| ❌ False | ✅ True | None | ✅ Yes | ✅ Yes | ❌ No | Cross-site API calls on HTTPS |
| ✅ True | ❌ False | Strict | ❌ No | ❌ No | ✅ Yes | Slightly safer dev config |
| ✅ True | ❌ False | Lax | ❌ No | ❌ No | ✅ Yes | Same-origin POST/GET allowed |
| ✅ True | ❌ False | None | ❌ No | ❌ Will be blocked! | ❌ No | ❌ Invalid combo |
| ✅ True | ✅ True | Strict | ❌ No | ❌ No | ❌ No | Most secure same-site config |
| ✅ True | ✅ True | Lax | ❌ No | ❌ No | ❌ No | Secure but limited to top-level navs |
| ✅ True | ✅ True | None | ❌ No | ✅ Yes | ❌ No | Best for cross-site requests (HTTPS only) |




# SessionID Cookie Configurations

| HttpOnly | Secure | SameSite | JS Accessible | Cross-Site Sent | HTTP Support | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| True | True | None | ❌ | ✅ | ❌ | Requires HTTPS. Not accessible to JS. Sent in cross-origin requests. |
| True | True | Lax | ❌ | ✅* | ❌ | Sent on top-level navigations and GET requests. |
| True | True | Strict | ❌ | ❌ | ❌ | Only sent in same-site requests. Most secure, limits cross-site usage. |
| True | False | None | ❌ | ✅ | ✅ | Accessible on HTTP but vulnerable to MITM. Not recommended. |
| True | False | Lax | ❌ | ✅* | ✅ | Good for same-site GETs, but not cross-origin POSTs. |
| True | False | Strict | ❌ | ❌ | ✅ | Most restricted on HTTP. Only same-site access. |
| False | True | None | ✅ | ✅ | ❌ | Visible to JS. Sent on HTTPS. Risky for session. |
| False | True | Lax | ✅ | ✅* | ❌ | Sent on top-level navigations and visible to JS. |
| False | True | Strict | ✅ | ❌ | ❌ | JS-accessible but not sent in cross-site requests. |
| False | False | None | ✅ | ✅ | ✅ | Fully visible and works on HTTP. Least secure. |
| False | False | Lax | ✅ | ✅* | ✅ | Accessible on JS and top-level GETs on HTTP. |
| False | False | Strict | ✅ | ❌ | ✅ | Only for same-site access. Readable on JS. |




# CSRF Token Cookie Configurations

| HttpOnly | Secure | SameSite | JS Accessible | Cross-Site Sent | HTTP Support | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| False | True | None | ✅ | ✅ | ❌ | Typical for modern HTTPS sites using JS to fetch and send CSRF tokens. |
| False | True | Lax | ✅ | ✅* | ❌ | Sent in same-site GETs and accessible via JS. |
| False | True | Strict | ✅ | ❌ | ❌ | Only available in same-site context. |
| False | False | None | ✅ | ✅ | ✅ | Fully visible and works even on HTTP. Insecure for production. |
| False | False | Lax | ✅ | ✅* | ✅ | Common for development use with same-site requests. |
| False | False | Strict | ✅ | ❌ | ✅ | Only for same-site access. Less risk of CSRF. |
| True | True | None | ❌ | ✅ | ❌ | Secure and hidden from JS. Usually not preferred for CSRF tokens. |
| True | True | Lax | ❌ | ✅* | ❌ | Hidden from JS and limited to top-level GETs. |
| True | True | Strict | ❌ | ❌ | ❌ | Most strict. Not usable in many CSRF setups. |
| True | False | None | ❌ | ✅ | ✅ | Works on HTTP. Hidden from JS. Insecure. |
| True | False | Lax | ❌ | ✅* | ✅ | Safer for same-site HTTP requests. |
| True | False | Strict | ❌ | ❌ | ✅ | Most restricted setup. |