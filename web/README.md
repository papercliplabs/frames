# Paperclip Labs Frame Server

This is the frame server for all Paperclip Labs frames

## Frames

### Nounish Auctions

Url: https://frames.paperclip.xyz/auction/<dao_name>

| DAO               | <dao_name>                                                                  |
| ----------------- | --------------------------------------------------------------------------- |
| Nouns             | [nouns](https://frames.paperclip.xyz/auction/nouns)                         |
| Yellow Collective | [yellow-collective](https://frames.paperclip.xyz/auction/yellow-collective) |
| Purple            | [purple-dao](https://frames.paperclip.xyz/auction/purple-dao)               |
| Based DAO         | [based-dao](https://frames.paperclip.xyz/auction/based-dao)                 |
| Based Management  | [based-management](https://frames.paperclip.xyz/auction/based-management)   |
| Builder DAO       | [builder-dao](https://frames.paperclip.xyz/auction/builder-dao)             |
| Lil Nouns         | [lil-nouns](https://frames.paperclip.xyz/auction/lil-nouns)                 |
| Energy            | [energy-dao](https://frames.paperclip.xyz/auction/energy-dao)               |
| Beans             | [beans-dao](https://frames.paperclip.xyz/auction/beans-dao)                 |

### Carousels 

Url: https://frames.paperclip.xyz/carrousel/<slug>
See [this page](./src/app/carousel/) for more details

| Name                                | <slug>                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------ |
| Beans dungeon mint                  | [beans-dungeon](https://frames.paperclip.xyz/carousel/beans-dungeon)                       |
| Beans dungeon no mint               | [beans-dungeon-no-mint](https://frames.paperclip.xyz/carousel/yellow-collective)           |
| Paperclip auction frame compilation | [paperclip-auction-frames](https://frames.paperclip.xyz/carousel/paperclip-auction-frames) |

### Mints

Url: https://frames.paperclip.xyz/mint/<collection>
See [this page](./src/app/mint/) for more details

| Name                       | <slug>                                                                                                     |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Based and Yellow           | [based-and-yellow-frame-edition-one](https://frames.paperclip.xyz/mint/based-and-yellow-frame-edition-one) |
| Beans The Adventure Begins | [beans-the-adventure-begins](https://frames.paperclip.xyz/mint/beans-the-adventure-begins)                 |
| Beans Entering the Unknown | [beans-entering-the-unknown](https://frames.paperclip.xyz/mint/beans-entering-the-unknown)                 |


## Development

Install dependencies
```bash
yarn
```

Copy `.env.example` to `.env` and populate it
```bash
cp .env.example .env
```

Run locally
```bash
yarn dev
```
