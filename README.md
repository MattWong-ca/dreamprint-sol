# Dreamprint

Dreamprint turns event photos into AI-generated artwork and mints them as NFTs on Solana. Attendees take a photo at an event, watch it transform into a custom AI portrait, and walk away with an onchain collectible.

Live app: https://www.dreamprint.app/
<br>
Demo: https://youtu.be/1ZKQsGRMfQg
<br>

<img width="1440" height="812" alt="Landing" src="https://github.com/user-attachments/assets/0297eec6-c61a-4e63-b83c-188629318deb" />

<img width="1440" height="812" alt="ETHRome" src="https://github.com/user-attachments/assets/fe1af821-529a-4a39-9c00-a3b516450443" />

<img width="1440" height="813" alt="Hack the North" src="https://github.com/user-attachments/assets/062ad837-f5c7-46dc-aaa4-964066f2974f" />

<img width="1440" height="812" alt="ETHGlobal NYC" src="https://github.com/user-attachments/assets/25a84567-03e5-4750-8e80-5875c11fda5b" />

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
