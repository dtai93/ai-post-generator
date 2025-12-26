"use client";

import { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import axios from 'axios';
import Image from 'next/image';
import { Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
import { parseEther } from 'viem';

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  const [meme, setMeme] = useState<{ title: string; url: string; subreddit: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [captions, setCaptions] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const creatorAddress = '0x8f37fdD3037b29195975d9e2F7bbb36ca51887dc';
  const creatorUsername = 'dtai93';

  const feeAmount = '0.0001';

  const cryptoKeywords = [
    'bitcoin', 'btc', 'crypto', 'cryptocurrency', 'ethereum', 'eth', 'solana', 'base',
    'pepe', 'doge', 'dogecoin', 'trump', 'hodl', 'moon', 'lfg', 'degen', 'gm', 'wagmi',
    'ngmi', 'fomo', 'diamondhands', 'paperhands', 'altcoin', 'memecoin', 'pump', 'dump',
    'etf', 'bitcoinreserve', 'cryptoetf',
  ];

  const fetchCryptoMeme = async () => {
    try {
      setLoading(true);
      setError(null);

      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        attempts++;

        const randomKeyword = cryptoKeywords[Math.floor(Math.random() * cryptoKeywords.length)];

        try {
          const response = await axios.get(`https://meme-api.com/gimme/${randomKeyword}`);

          const data = response.data;

          if (data.url && data.title && data.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
            setMeme({
              title: data.title,
              url: data.url,
              subreddit: data.subreddit || 'crypto',
            });

            const title = data.title;
            const templates = [
              `${title}\n\nThis hits different in bull market 🚀\nLFG degen! #Crypto #Memecoin`,
              `Real degen moment 😂\n"${title}"\nWho's still HODLing? 🦍💎\n#BaseChain`,
              `POV: You're waiting for the pump\n${title}\nBut you're not selling 🌙🔥`,
              `Daily meme dose for crypto bros 📩\n${title}\nTag your squad! 👥`,
              `When Trump talks crypto again:\n${title}\nMarket loading... ⏳ #Bitcoin`,
              `This meme is pure alpha 🚀\n${title}\nBase season never ends! #Base`,
              `Classic crypto life 😂\n${title}\nWAGMI or NGMI? #Degen`,
            ];

            const shuffled = templates.sort(() => 0.5 - Math.random());
            setCaptions(shuffled.slice(0, 5));

            setLoading(false);
            return;
          }
        } catch (e) {
          continue;
        }
      }

      throw new Error('No hot crypto meme found today 😭');
    } catch (err) {
      setError('Failed to load meme after multiple attempts, try hunting a new one 🚀');
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [isFrameReady, setFrameReady]);

  useEffect(() => {
    fetchCryptoMeme();
  }, []);

  const handleCopyCaption = (caption: string, index: number) => {
    navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePostSuccess = () => {
    alert(
      `Success! 🎉\n\nNow copy your favorite caption + attach the meme image and cast it!\nTag @dtai93 so I can recast for extra virality ❤️`
    );
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      />

      {/* Custom style ép nền đen chữ trắng */}
      <style jsx global>{`
        body, html, .card, .alert, .btn {
          background-color: #121212 !important;
          color: white !important;
        }
        .card-body, .card-title, .card-text, p, h1, h2, h3, h4 {
          color: white !important;
        }
        .text-muted {
          color: #ffc107 !important;
        }
        .btn-warning {
          background-color: #ffc107 !important;
          color: #000 !important;
        }
        .btn-primary {
          background-color: #0d6efd !important;
          color: white !important;
        }
        .btn-success {
          background-color: #198754 !important;
          color: white !important;
        }
      `}</style>

      <main className="min-h-screen bg-dark text-white">
        <div className="container py-4">
          <h1 className="display-5 fw-bold text-center mb-2 text-white">AI Post Generator 🚀</h1>
          <p className="text-center mb-4 text-white opacity-90">
            Daily crypto meme fire + AI caption ready to cast 🔥
          </p>

          {loading && (
            <div className="text-center my-5">
              <div className="spinner-border text-warning" role="status"></div>
              <p className="mt-3 fs-4 text-white">Hunting for today's fire crypto meme...</p>
            </div>
          )}

          {error && <div className="alert alert-warning text-dark text-center">{error}</div>}

          {meme && !loading && (
            <div className="row justify-content-center">
              <div className="col-12 col-md-8 col-lg-6">
                <div className="card bg-dark border-0 shadow-lg mb-4">
                  <div className="card-body text-center py-3">
                    <h2 className="card-title fw-bold fs-4 mb-1 text-white">{meme.title}</h2>
                    <p className="text-warning small">Hot from r/{meme.subreddit} 🔥</p>
                  </div>
                </div>

                <div className="card bg-dark border-0 shadow-lg overflow-hidden mb-4">
                  <Image
                    src={meme.url}
                    alt={meme.title}
                    width={800}
                    height={800}
                    className="card-img-top"
                    priority
                  />
                </div>

                <button
                  onClick={fetchCryptoMeme}
                  className="btn btn-warning btn-lg w-100 mb-4 fw-bold shadow text-dark"
                >
                  Hunt New Hot Meme 🔥
                </button>

                <div className="text-center mb-4">
                  <p className="fw-bold mb-3 text-white">
                    Follow @dtai93 for daily memes + degen captions 🦍
                  </p>
                  <a
                    href="https://warpcast.com/dtai93"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-warning btn-lg w-100 fw-bold shadow text-dark"
                  >
                    Follow @dtai93 now! 🔔
                  </a>
                </div>

                <div className="card bg-dark border-0 shadow-lg mb-4">
                  <div className="card-body">
                    <h3 className="card-title text-center fw-bold mb-4 text-white">
                      AI Suggested Captions – Copy & Cast 🚀
                    </h3>
                    {captions.map((cap, i) => (
                      <div key={i} className="bg-secondary bg-opacity-30 rounded-3 p-3 mb-3">
                        <p className="mb-3 text-white">{cap}</p>
                        <button
                          onClick={() => handleCopyCaption(cap, i)}
                          className="btn btn-primary btn-sm"
                        >
                          {copiedIndex === i ? 'Copied! ✅' : 'Copy Caption'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <Transaction
                    chainId={8453}
                    calls={[
                      {
                        to: creatorAddress,
                        value: parseEther(feeAmount),
                      },
                    ]}
                    onSuccess={handlePostSuccess}
                  >
                    <TransactionButton
                      text="Post Now 🚀"
                      className="btn btn-success btn-lg w-100 fw-bold shadow-lg py-4 fs-4 text-white"
                    />
                  </Transaction>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}