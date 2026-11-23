import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  AudioLines,
  Check,
  ChevronDown,
  Heart,
  MessageCircle,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { formatPrice } from "./format.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const categories = ["All", "Audio", "Footwear", "Wearables"];
const productArt = {
  Audio: { emoji: "🎧", color: "lavender", label: "SOUND, ALL DAY" },
  Footwear: { emoji: "👟", color: "peach", label: "GO YOUR OWN WAY" },
  Wearables: { emoji: "⌚", color: "mint", label: "LIFE IN MOTION" },
};

const fallbackProducts = [
  { id: 1, name: "boAt Airdopes 141", category: "Audio", brand: "boAt", price: 1299, rating: 4.2, stock: 24, description: "Wireless earbuds with up to 42 hours of playback and low-latency mode.", tags: ["wireless", "bluetooth", "earbuds", "long battery"] },
  { id: 2, name: "Noise Buds VS104", category: "Audio", brand: "Noise", price: 1499, rating: 4.1, stock: 18, description: "Truly wireless earbuds with up to 45 hours of playtime and quad mic ENC.", tags: ["wireless", "bluetooth", "earbuds", "long battery"] },
  { id: 3, name: "JBL Wave Buds", category: "Audio", brand: "JBL", price: 2799, rating: 4.4, stock: 12, description: "Deep bass true wireless earbuds with a compact, comfortable fit.", tags: ["wireless", "bluetooth", "earbuds", "bass"] },
  { id: 4, name: "Sony WF-C500", category: "Audio", brand: "Sony", price: 4990, rating: 4.5, stock: 7, description: "Reliable wireless earbuds with clear sound and up to 20 hours of battery.", tags: ["wireless", "bluetooth", "earbuds", "sound"] },
  { id: 5, name: "Nike Revolution 7", category: "Footwear", brand: "Nike", price: 3695, rating: 4.3, stock: 10, description: "Everyday road running shoe with soft cushioning and a breathable upper.", tags: ["running", "shoes", "cushioned", "sports"] },
  { id: 6, name: "Adidas Duramo SL", category: "Footwear", brand: "Adidas", price: 4299, rating: 4.2, stock: 8, description: "Lightweight running shoes designed for daily training and comfort.", tags: ["running", "shoes", "lightweight", "sports"] },
  { id: 7, name: "Noise ColorFit Pulse 4", category: "Wearables", brand: "Noise", price: 1799, rating: 4.0, stock: 20, description: "Smart watch with a bright display, activity tracking, and long battery life.", tags: ["smartwatch", "fitness", "wearables", "battery"] },
  { id: 8, name: "boAt Wave Neo", category: "Wearables", brand: "boAt", price: 1599, rating: 3.9, stock: 15, description: "Everyday smartwatch with a large display and multiple sports modes.", tags: ["smartwatch", "fitness", "wearables"] },
];

const initialMessages = [
  {
    role: "assistant",
    content: "Hi! I’m your ShopKart shopping assistant. Tell me what you’re looking for — I can find a great match for you. ✨",
  },
];

function ProductCard({ product, saved, onToggleFavorite, onAdd }) {
  const art = productArt[product.category] || productArt.Audio;

  return (
    <article className="product-card">
      <div className={`product-art ${art.color}`}>
        <span className="art-label">{art.label}</span>
        <button
          className={`favorite-button ${saved ? "is-saved" : ""}`}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => onToggleFavorite(product.id)}
        >
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
        </button>
        <span className="product-emoji" aria-hidden="true">{art.emoji}</span>
        <span className="art-orbit orbit-one" />
        <span className="art-orbit orbit-two" />
      </div>
      <div className="product-copy">
        <div className="product-meta"><span>{product.brand}</span><span className="rating"><Star size={13} fill="currentColor" /> {product.rating}</span></div>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-buy-row">
          <div><strong>{formatPrice(product.price)}</strong><span className="stock-hint">{product.stock > 0 ? `${product.stock} in stock` : "Sold out"}</span></div>
          <button className="add-button" onClick={() => onAdd(product)} disabled={product.stock < 1}>
            <ShoppingBag size={15} /> Add
          </button>
        </div>
      </div>
    </article>
  );
}

function BagPanel({ cart, onClose, onChangeQuantity, onRemove, onCheckout, checkout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bag-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <aside className="bag-panel" role="dialog" aria-modal="true" aria-labelledby="bag-title">
        <header className="bag-header">
          <div><span className="eyebrow section-eyebrow">YOUR GOOD FINDS</span><h2 id="bag-title">Your bag <span>({cart.reduce((sum, item) => sum + item.quantity, 0)})</span></h2></div>
          <button className="icon-button bag-close" aria-label="Close bag" onClick={onClose}><X size={20} /></button>
        </header>
        {checkout.orderId && <p className="checkout-success" role="status">Order #{checkout.orderId} placed. Thanks for shopping with us!</p>}
        {checkout.error && <p className="checkout-error" role="alert">{checkout.error}</p>}
        {cart.length === 0 ? (
          <div className="bag-empty"><ShoppingBag size={30} /><strong>Your bag is taking a breather.</strong><span>Add something lovely to get started.</span><button onClick={onClose}>Keep browsing</button></div>
        ) : (
          <>
            <div className="bag-items">
              {cart.map((item) => {
                const art = productArt[item.category] || productArt.Audio;
                return (
                  <article className="bag-item" key={item.id}>
                    <div className={`bag-item-art ${art.color}`} aria-hidden="true">{art.emoji}</div>
                    <div className="bag-item-copy">
                      <strong>{item.name}</strong><span>{formatPrice(item.price)}</span>
                      <div className="quantity-control" aria-label={`${item.name} quantity`}>
                        <button aria-label={`Decrease ${item.name} quantity`} onClick={() => onChangeQuantity(item.id, item.quantity - 1)}><Minus size={13} /></button>
                        <span>{item.quantity}</span>
                        <button aria-label={`Increase ${item.name} quantity`} onClick={() => onChangeQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}><Plus size={13} /></button>
                        <button className="remove-item" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.id)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <strong className="bag-item-total">{formatPrice(item.price * item.quantity)}</strong>
                  </article>
                );
              })}
            </div>
            <div className="bag-summary">
              <div><span>Subtotal</span><strong>{formatPrice(total)}</strong></div>
              <small>Shipping is on us for orders over ₹999.</small>
              <button className="checkout-button" onClick={onCheckout} disabled={checkout.loading}>
                {checkout.loading ? "Placing your order…" : <>Place demo order <ArrowRight size={16} /></>}
              </button>
              <small className="demo-checkout-note">Demo checkout places an order in the ShopKart API; no payment is collected.</small>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  async function sendMessage(text = input) {
    const message = text.trim();
    if (!message || sending) return;
    setInput("");
    const history = messages
      .filter((item) => !item.pending && (item.role === "user" || item.role === "assistant"))
      .slice(-20)
      .map(({ role, content }) => ({ role, content }));
    setMessages((items) => [...items, { role: "user", content: message }, { role: "assistant", content: "", pending: true }]);
    setSending(true);
    try {
      const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({ message, customerId: 1, history }),
      });
      if (!response.ok) throw new Error(`Chat request failed (${response.status})`);
      if (!response.body) throw new Error("Streaming is not supported by this browser.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let reply = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const event of events) {
          const data = event.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart()).join("\n");
          if (!data || data === "[DONE]") continue;
          try {
            reply += JSON.parse(data);
          } catch {
            reply += data;
          }
          setMessages((items) => items.map((item, index) => index === items.length - 1 ? { role: "assistant", content: reply } : item));
        }
      }
      if (!reply) throw new Error("The assistant returned an empty reply.");
    } catch (error) {
      setMessages((items) => [...items.slice(0, -1), { role: "assistant", content: `I couldn’t reach the ShopKart assistant. ${error.message} Check that the backend is running on port 8080.` }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="chat-panel" aria-label="ShopKart AI shopping assistant">
      <header className="chat-header">
        <div className="chat-avatar"><Sparkles size={19} /></div>
        <div className="chat-title"><strong>Your shopping sidekick</strong><span><i /> Here to help</span></div>
        <button className="icon-button close-chat" aria-label="Close chat" onClick={onClose}><X size={19} /></button>
      </header>
      <div className="chat-messages">
        <div className="chat-day">TODAY</div>
        {messages.map((message, index) => (
          <div className={`message-row ${message.role}`} key={`${message.role}-${index}`}>
            {message.role === "assistant" && <div className="message-avatar"><Sparkles size={14} /></div>}
            <div className="message-bubble">
              {message.pending ? <span className="typing"><i /><i /><i /></span> : message.content}
            </div>
          </div>
        ))}
        {messages.length === 1 && <div className="suggestions">
          <button onClick={() => sendMessage("Wireless earbuds under ₹3000 with good battery")}>Earbuds under ₹3000 <ArrowRight size={13} /></button>
          <button onClick={() => sendMessage("Show me running shoes")}>Running shoes <ArrowRight size={13} /></button>
        </div>}
      </div>
      <form className="chat-input" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
        <input aria-label="Message the shopping assistant" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask me anything..." disabled={sending} />
        <button aria-label="Send message" type="submit" disabled={!input.trim() || sending}><ArrowUp size={18} /></button>
      </form>
      <div className="chat-footnote"><ShieldCheck size={12} /> Your data stays private and secure</div>
    </section>
  );
}

export default function App() {
  const [products, setProducts] = useState(fallbackProducts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [wishlist, setWishlist] = useState(() => new Set());
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("rating");
  const [checkout, setCheckout] = useState({ loading: false, error: "", orderId: null });
  const [toast, setToast] = useState("");
  const [loadError, setLoadError] = useState(false);
  const searchInput = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((response) => {
        if (!response.ok) throw new Error("Catalog request failed");
        return response.json();
      })
      .then((data) => { setProducts(data); setLoadError(false); })
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.current?.focus();
      }
      if (event.key === "Escape") {
        setBagOpen(false);
        setExploreOpen(false);
        setChatOpen(false);
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || `${product.name} ${product.brand} ${product.category} ${product.description} ${(product.tags || []).join(" ")}`.toLowerCase().includes(term);
    const matchesWishlist = !wishlistOnly || wishlist.has(product.id);
    return matchesCategory && matchesSearch && matchesWishlist;
  }).sort((a, b) => {
    if (sortOrder === "price-low") return a.price - b.price;
    if (sortOrder === "price-high") return b.price - a.price;
    if (sortOrder === "name") return a.name.localeCompare(b.name);
    return b.rating - a.rating;
  }), [products, activeCategory, search, wishlistOnly, wishlist, sortOrder]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  function addToCart(product) {
    const current = cart.find((item) => item.id === product.id);
    if ((current?.quantity ?? 0) >= product.stock) {
      setToast(`Only ${product.stock} ${product.name} available`);
      window.setTimeout(() => setToast(""), 2600);
      return;
    }
    setCart((items) => {
      if (items.some((item) => item.id === product.id)) return items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...items, { ...product, quantity: 1 }];
    });
    setCheckout({ loading: false, error: "", orderId: null });
    setToast(`${product.name} added to your bag`);
    window.setTimeout(() => setToast(""), 2600);
  }

  function changeQuantity(productId, quantity) {
    setCart((items) => items.map((item) => item.id === productId
      ? { ...item, quantity: Math.min(item.stock, Math.max(0, quantity)) }
      : item).filter((item) => item.quantity > 0));
    setCheckout({ loading: false, error: "", orderId: null });
  }

  function toggleFavorite(productId) {
    setWishlist((current) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }

  async function placeOrder() {
    setCheckout({ loading: true, error: "", orderId: null });
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: 1,
          items: cart.map(({ id, quantity }) => ({ productId: id, quantity })),
        }),
      });
      const order = await response.json();
      if (!response.ok) throw new Error(order.detail || `Order request failed (${response.status})`);
      setCart([]);
      setCheckout({ loading: false, error: "", orderId: order.id });
      try {
        const catalog = await fetch(`${API_URL}/api/products`);
        if (!catalog.ok) throw new Error(`Catalog refresh failed (${catalog.status})`);
        setProducts(await catalog.json());
        setLoadError(false);
      } catch {
        setLoadError(true);
      }
    } catch (error) {
      setCheckout({ loading: false, error: `We couldn’t place your order. ${error.message}`, orderId: null });
    }
  }

  return (
    <div className="app-shell" id="top">
      <div className="announcement"><Sparkles size={14} /> Thoughtful finds, delivered with a little help from AI. <span>Meet your shopping sidekick <ArrowRight size={13} /></span></div>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="ShopKart home"><span className="brand-mark">s<span>.</span></span>shopkart</a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-active" href="#shop">Shop</a>
          <a href="#why-shopkart">Our story</a>
          <div className="nav-explore">
            <button className="nav-dropdown" aria-expanded={exploreOpen} onClick={() => setExploreOpen((open) => !open)}>Explore <ChevronDown size={14} /></button>
            {exploreOpen && <div className="explore-menu" role="menu">{categories.map((category) => <button key={category} role="menuitem" onClick={() => { setActiveCategory(category); setWishlistOnly(false); setExploreOpen(false); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>{category}</button>)}</div>}
          </div>
        </nav>
        <div className="header-actions">
        <label className="search-box"><Search size={16} /><input ref={searchInput} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find your thing..." aria-label="Search products" /><kbd>⌘ K</kbd></label>
        <button className="bag-button" aria-label={`Shopping bag, ${cartCount} items`} onClick={() => setBagOpen(true)}><ShoppingBag size={19} /><span>Bag</span><b>{cartCount}</b></button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> THE EVERYDAY EDIT — VOL. 01</div>
            <h1>Good things,<br /><span>picked for you.</span></h1>
            <p>Discover the little upgrades that make a big difference. And if you need a hand, just ask.</p>
            <a className="hero-cta" href="#shop">Explore the edit <ArrowDown size={15} /></a>
            <div className="hero-social-proof"><div className="avatar-stack"><span>R</span><span>A</span><span>M</span></div><div><div className="proof-stars">★★★★★</div><small>Loved by 2,400+ happy shoppers</small></div></div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-bg"><div className="hero-sun" /><span className="hero-product hero-shoe">👟</span><span className="hero-product hero-earbuds">🎧</span><span className="hero-product hero-watch">⌚</span><div className="hero-sticker"><Sparkles size={16} /><span>your<br />next fave</span></div></div>
            <div className="floating-note"><span className="note-icon"><Star size={14} fill="currentColor" /></span><span><strong>Good taste.</strong><small>Zero guesswork.</small></span></div>
            <div className="hero-caption">CURATED FOR THE EVERYDAY <span>01 / 03</span></div>
          </div>
          <div className="hero-vertical-note">MADE FOR YOUR KIND OF EVERYDAY</div>
        </section>

        <section className="trust-strip" aria-label="ShopKart benefits">
          <div><Truck size={17} /><span>Free delivery over ₹999</span></div><i />
          <div><ShieldCheck size={17} /><span>Thoughtful picks, always</span></div><i />
          <div><PackageCheck size={17} /><span>Easy 7-day returns</span></div><i />
          <div><AudioLines size={17} /><span>Real help when you need it</span></div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div><div className="eyebrow section-eyebrow">A LITTLE BIT OF EVERYTHING</div><h2>The good stuff<span>.</span></h2><p>Useful, well-loved, and worth the spot on your shelf.</p></div>
            <a href="#shop" className="view-all">View the edit <ArrowRight size={15} /></a>
          </div>
          <div className="shop-toolbar">
            <div className="category-tabs" role="tablist" aria-label="Filter by category">
              {categories.map((category) => <button key={category} className={activeCategory === category && !wishlistOnly ? "active" : ""} onClick={() => { setActiveCategory(category); setWishlistOnly(false); }} role="tab" aria-selected={activeCategory === category && !wishlistOnly}>{category}<span>{category === "All" ? products.length : products.filter((product) => product.category === category).length}</span></button>)}
              <button className={`wishlist-tab ${wishlistOnly ? "active" : ""}`} onClick={() => setWishlistOnly((value) => !value)} role="tab" aria-selected={wishlistOnly}><Heart size={12} /> Saved <span>{wishlist.size}</span></button>
            </div>
            <label className="sort-label">SORT BY <select aria-label="Sort products" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="rating">Most loved</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select></label>
          </div>
          {loadError && <p className="api-notice">Showing the sample collection. Start the backend to load live inventory.</p>}
          <div className="product-grid">
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} saved={wishlist.has(product.id)} onToggleFavorite={toggleFavorite} onAdd={addToCart} />)}
            {filteredProducts.length === 0 && <div className="empty-state"><Search size={25} /><strong>{wishlistOnly && wishlist.size === 0 ? "Nothing saved just yet." : "No finds just yet."}</strong><span>{wishlistOnly ? "Tap a product heart to save it here." : "Try another search or category."}</span></div>}
          </div>
        </section>

        <section className="assistant-banner" id="why-shopkart">
          <div className="banner-sparkle"><Sparkles size={23} /></div>
          <div><div className="eyebrow">A BETTER WAY TO BROWSE</div><h2>Not sure what you need?<br /><span>Just ask.</span></h2><p>Tell our little shopping assistant what you’re after. It’ll find the right stuff, without the endless scrolling.</p><button className="banner-button" onClick={() => setChatOpen(true)}>Meet your sidekick <ArrowRight size={15} /></button></div>
          <div className="banner-chat-preview"><div className="preview-top"><span className="preview-avatar"><Sparkles size={13} /></span><span><strong>ShopKart sidekick</strong><small>just now</small></span><i /></div><div className="preview-user">Earbuds under ₹3,000 with great battery?</div><div className="preview-assistant">On it! I found a few great options with 40+ hours of playtime. 🎧</div><div className="preview-pills"><span>✦ Knows your budget</span><span>✦ No guesswork</span></div></div>
          <div className="banner-decoration">✳</div>
        </section>
      </main>

      <footer className="site-footer"><a className="wordmark" href="#top"><span className="brand-mark">s<span>.</span></span>shopkart</a><span>Good finds. Good feelings. © 2026 ShopKart.</span><a href="#shop">Back to the good stuff <ArrowUp size={13} /></a></footer>

      <button className={`chat-launcher ${chatOpen ? "chat-active" : ""}`} onClick={() => setChatOpen((open) => !open)} aria-label={chatOpen ? "Close shopping assistant" : "Open shopping assistant"}>
        {chatOpen ? <X size={21} /> : <><MessageCircle size={20} /><span>Ask ShopKart</span><span className="launcher-sparkle"><Sparkles size={12} /></span></>}
      </button>
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
      {bagOpen && <BagPanel cart={cart} onClose={() => setBagOpen(false)} onChangeQuantity={changeQuantity} onRemove={(id) => changeQuantity(id, 0)} onCheckout={placeOrder} checkout={checkout} />}
      {toast && <div className="toast"><span><Check size={14} /></span>{toast}</div>}
    </div>
  );
}
