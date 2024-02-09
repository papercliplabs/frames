# Gated Minting

## Flow
```mermaid
flowchart TD
    A[Home] --> B{Minted\nout} 
    B --"yes"--> C[Minted out]
    B --"no"--> D{Has\nAddress}
    D --"yes"--> E{Already\nminted}
    D --"no"--> F[No\nAddress]
    E --"no"--> G{Conditions\nmet}
    E --"yes"--> H[Already\nminted]
    G --"no"--> I[Cond not\nmet]
    G --"yes"--> J{Compose\nframe}
    J --"no"--> K[Minted]
    J --"yes"--> L[compose]
```

## Pages
- Home: static
- Minted out: static
- Already minted: static
- No address: static
- Conditions not met: dynamic
- Minted: static

## Custom logic
- Minted out: boolean
- Already minted: boolean
- Conditions met: boolean + payload for dynamic conditions not met page
- Mint: void 

## Compose query params
* `compose-frame-url`: url to push to instead of minting of it exists
