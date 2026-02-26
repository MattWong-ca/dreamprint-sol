# Dreamprint

Dreamprint turns event photos into AI-generated artwork and mints them as NFTs on Solana. Attendees take a photo at an event, watch it transform into a custom AI portrait, and walk away with an onchain collectible.

Live app: https://www.dreamprint.app/
<br>
Demo: https://youtu.be/1ZKQsGRMfQg
<br>
Previous events: https://www.dreamprint.app/events


## Tech Stack

Dreamprint is built on Next.js with a serverless API layer, Solana for NFT minting, and Replicate for AI image generation. The stack is designed to be fast to deploy and easy to run at live events with minimal setup.

- **Replicate (Flux Kontext Pro)** — AI image transformation
- **Cloudinary** — Image hosting and CDN for generated artwork
- **Supabase** — PostgreSQL database for orders, claim IDs, and mint status
- **Solana (devnet)** — NFT minting
- **Metaplex MPL Core** — NFT standard used for minting
- **@solana/wallet-adapter** — Wallet connection
- **Fujifilm Instax Printer** - Printing physical polaroids

After all guests have minted their NFTs, event hosts can leverage Exchange Art to curate a gallery featuring everyone that attended the event. 

## Roadmap

- Gasless transactions to improve UX, especially for those that don’t have wallets
- Burner wallets, so privacy-conscious attendees don’t need to associate their regular wallets with AI photos
- Most importantly: partner with upcoming Solana events to bring onchain polaroids to more people!