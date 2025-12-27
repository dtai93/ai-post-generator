"use client";

import { useEffect, useState } from 'react';
import { useMiniKit, useComposeCast } from '@coinbase/onchainkit/minikit';
import axios from 'axios';
import Image from 'next/image';
import { Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
import { parseEther } from 'viem';

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { composeCast } = useComposeCast();

  const [meme, setMeme] = useState<{ title: string; url: string; source: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [captions, setCaptions] = useState<string[]>([]);
  const [selectedCaption, setSelectedCaption] = useState<string | null>(null); // Caption user chọn

  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([]);
  const [usedMemeUrls, setUsedMemeUrls] = useState<Set<string>>(new Set());
  const [imgflipTemplates, setImgflipTemplates] = useState<{ id: string; name: string; url: string }[]>([]);

  const creatorAddress = '0x8f37fdD3037b29195975d9e2F7bbb36ca51887dc';
  const feeAmount = '0.00001';

  const sources = ['imgflip', 'reddit', 'memegen', 'd3vd'] as const;
  type SourceType = typeof sources[number];

  // Fetch trending keywords từ CoinGecko
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get('https://api.coingecko.com/api/v3/search/trending');
        const keywords = (res.data.coins || []).flatMap((item: any) => [
          item.item.name.toLowerCase(),
          item.item.symbol.toLowerCase(),
        ]);
        setTrendingKeywords(keywords.length ? keywords : ['bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'memecoin']);
      } catch {
        setTrendingKeywords(['bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'memecoin']);
      }
    };
    fetchTrending();
  }, []);

  // Cache Imgflip templates
  useEffect(() => {
    const fetchImgflip = async () => {
      try {
        const res = await axios.get('https://api.imgflip.com/get_memes');
        if (res.data.success) setImgflipTemplates(res.data.data.memes);
      } catch {}
    };
    fetchImgflip();
  }, []);

  const fetchRandomMeme = async (retryCount = 0): Promise<void> => {
    if (retryCount >= 10) {
      setError('Failed to load meme after multiple attempts. Please try again later 🚀');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const randomSource: SourceType = sources[Math.floor(Math.random() * sources.length)];
      const keyword = trendingKeywords.length > 0 ? trendingKeywords[Math.floor(Math.random() * trendingKeywords.length)] : 'meme';

      let selectedUrl = '';
      let selectedTitle = '';
      let sourceName = randomSource;

      if (randomSource === 'imgflip' && imgflipTemplates.length > 0) {
        let available = imgflipTemplates.filter(t => !usedMemeUrls.has(t.url));
        if (available.length === 0) {
          setUsedMemeUrls(new Set());
          available = imgflipTemplates;
        }
        const template = available[Math.floor(Math.random() * available.length)];
        selectedUrl = template.url;
        selectedTitle = template.name;
      } else if (randomSource === 'reddit') {
        const subreddits = ['memes', 'dankmemes', 'wholesomememes', 'me_irl'];
        const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
        const searchUrl = keyword ? `https://www.reddit.com/r/${subreddit}/search.json?q=${keyword}&restrict_sr=on&sort=hot&limit=50` : `https://www.reddit.com/r/${subreddit}/hot.json?limit=50`;
        const res = await axios.get(searchUrl);
        const validPosts = res.data.data.children
          .filter((p: any) => p.data.post_hint === 'image' && p.data.url.match(/\.(jpg|jpeg|png|gif)$/i))
          .map((p: any) => p.data);

        let available = validPosts.filter((p: any) => !usedMemeUrls.has(p.url));
        if (available.length === 0) {
          setUsedMemeUrls(new Set());
          available = validPosts;
        }
        if (available.length > 0) {
          const post = available[Math.floor(Math.random() * available.length)];
          selectedUrl = post.url;
          selectedTitle = post.title;
        }
      } else if (randomSource === 'memegen') {
        const templates = [
          'buzz', 'drake', 'fry', 'doge', 'spongebob', 'change-my-mind', 'success-kid',
          'distracted-bf', 'ancient-aliens', 'rollsafe', 'puffin', 'both', 'iw', 'ds', 'ugandanknuck',
          'one-does-not-simply', 'expanding-brain', 'mocking-spongebob', 'sad-affleck'
        ];
        const template = templates[Math.floor(Math.random() * templates.length)];
        selectedUrl = `https://api.memegen.link/images/${template}.png`;
        selectedTitle = template.charAt(0).toUpperCase() + template.slice(1).replace(/-/g, ' ');
      } else if (randomSource === 'd3vd') {
        try {
          const res = await axios.get(`https://meme-api.com/gimme/${keyword}`);
          if (res.data.url && res.data.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
            selectedUrl = res.data.url;
            selectedTitle = res.data.title || 'Funny Meme';
          }
        } catch {}
      }

      if (!selectedUrl || !selectedUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return fetchRandomMeme(retryCount + 1);
      }

      setUsedMemeUrls(prev => new Set(prev).add(selectedUrl));
      setMeme({ title: selectedTitle, url: selectedUrl, source: sourceName });

      const title = selectedTitle;
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
      setSelectedCaption(null); // Reset selection khi load meme mới

      setLoading(false);
    } catch (err) {
      fetchRandomMeme(retryCount + 1);
    }
  };

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  useEffect(() => {
    if (trendingKeywords.length > 0 && !meme) fetchRandomMeme();
  }, [trendingKeywords]);

  // User chọn caption
  const handleSelectCaption = (caption: string) => {
    setSelectedCaption(caption);
  };

  // Thanh toán thành công → mở composer với caption đã chọn + ảnh meme
  const handlePostSuccess = () => {
    if (!meme || !selectedCaption) return;

    composeCast({
      text: selectedCaption,
      embeds: [meme.url],
    });
  };

  const handleTransactionError = (err: any) => {
    const msg = err?.message || err?.shortMessage || 'Unknown error';
    setError(`Transaction failed: ${msg}. Please check your wallet on Base mainnet.`);
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />

      <style jsx global>{`
        body, html, .card, .alert, .btn { background-color: #121212 !important; color: white !important; }
        .card-body, .card-title, .card-text, p, h1, h2, h3, h4 { color: white !important; }
        .text-muted { color: #ffc107 !important; }
        .btn-warning { background-color: #ffc107 !important; color: #000 !important; }
        .btn-primary { background-color: #0d6efd !important; color: white !important; }
        .btn-success { background-color: #198754 !important; color: white !important; }
      `}</style>

      <main className="min-h-screen bg-dark text-white">
        <div className="container py-4">
          <h1 className="display-5 fw-bold text-center mb-2 text-white">AI Post Generator 🚀</h1>
          <p className="text-center mb-4 text-white opacity-90">
            Multi-source funny memes + real-time crypto trends 🔥
          </p>

          {loading && (
            <div className="text-center my-5">
              <div className="spinner-border text-warning" role="status"></div>
              <p className="mt-3 fs-4 text-white">Hunting fresh meme from multiple sources...</p>
            </div>
          )}

          {error && <div className="alert alert-danger text-center">{error}</div>}

          {meme && !loading && (
            <div className="row justify-content-center">
              <div className="col-12 col-md-8 col-lg-6">
                <div className="card bg-dark border-0 shadow-lg mb-4">
                  <div className="card-body text-center py-3">
                    <h2 className="card-title fw-bold fs-4 mb-1 text-white">{meme.title}</h2>
                    <p className="text-warning small">Source: {meme.source} 🔥</p>
                  </div>
                </div>

                <div className="card bg-dark border-0 shadow-lg overflow-hidden mb-4">
                  <Image src={meme.url} alt={meme.title} width={800} height={800} className="card-img-top" priority unoptimized />
                </div>

                <button onClick={() => fetchRandomMeme()} className="btn btn-warning btn-lg w-100 mb-4 fw-bold shadow text-dark">
                  Hunt New Trending Meme 🔥
                </button>

                <div className="text-center mb-4">
                  <p className="fw-bold mb-3 text-white">Follow @dtai93 for daily memes + degen captions 🦍</p>
                  <a href="https://warpcast.com/dtai93" target="_blank" rel="noopener noreferrer" className="btn btn-warning btn-lg w-100 fw-bold shadow text-dark">
                    Follow @dtai93 now! 🔔
                  </a>
                </div>

                <div className="card bg-dark border-0 shadow-lg mb-4">
                  <div className="card-body">
                    <h3 className="card-title text-center fw-bold mb-4 text-white">
                      AI Suggested Captions – Select One to Post 🚀
                    </h3>
                    {captions.map((cap, i) => (
                      <div key={i} className={`bg-secondary bg-opacity-30 rounded-3 p-3 mb-3 ${selectedCaption === cap ? 'border border-success' : ''}`}>
                        <p className="mb-3 text-white">{cap}</p>
                        <button
                          onClick={() => handleSelectCaption(cap)}
                          className={`btn btn-${selectedCaption === cap ? 'success' : 'primary'} btn-sm`}
                        >
                          {selectedCaption === cap ? 'Selected ✅' : 'Select Caption'}
                        </button>
                      </div>
                    ))}
                    {!selectedCaption && <p className="text-warning small text-center">Please select a caption to enable Post Now</p>}
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
                    onError={handleTransactionError}
                  >
                    <TransactionButton
                      text={selectedCaption ? "Post Now 🚀" : "Select Caption First"}
                      disabled={!selectedCaption} // Mờ nút nếu chưa chọn caption
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