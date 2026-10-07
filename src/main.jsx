import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http, useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { mainnet, base, bsc } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import {
  Bell, ChevronDown, ChevronRight, Copy, Download, Gift, Globe2,
  Home, LineChart, Search, Send, ShieldCheck, Sparkles, Wallet,
  ArrowLeftRight, Activity, UserRound, X, Check
} from 'lucide-react';
import './styles.css';

const config = createConfig({
  chains: [mainnet, base, bsc],
  connectors: [injected()],
  transports: { [mainnet.id]: http(), [base.id]: http(), [bsc.id]: http() }
});
const queryClient = new QueryClient();

const tokens = [
  { symbol: 'RADRP', name: 'RADRP', price: '$0.366', change: '+83.40%', volume: '$2.24M', cap: '$3.65M', icon: 'R' },
  { symbol: 'SpaceXSI', name: 'SpaceXSI', price: '$0.519', change: '+1284.05%', volume: '$43.96M', cap: '$1.04M', icon: 'S' },
  { symbol: 'SpaceXSI', name: 'SpaceXSI', price: '$0.000251', change: '+1206.09%', volume: '$435,068', cap: '$231,589.98', icon: 'S' },
  { symbol: 'COOL', name: 'COOL', price: '$0.00116', change: '+183.97%', volume: '$3.72M', cap: '$1.16M', icon: 'C' },
  { symbol: 'Rocket', name: 'Rocket', price: '$0.04526', change: '+24.91%', volume: '$133,715.63', cap: '$5.21M', icon: '🚀' },
  { symbol: 'WEON', name: 'WEON', price: '$2.146', change: '+22.39%', volume: '$839,468.4', cap: '$12.85M', icon: 'W' },
  { symbol: 'AnyPS5', name: 'AnyPS5', price: '$0.000544', change: '+7928.65%', volume: '$2.19M', cap: '$514,026.13', icon: 'A' }
];

function App() {
  const [tab, setTab] = useState('Hot');
  const [page, setPage] = useState('Home');
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => tokens.filter(t => `${t.name} ${t.symbol}`.toLowerCase().includes(search.toLowerCase())), [search]);

  return <div className="app-shell">
    <div className="app-bg" />
    <header className="topbar">
      <div className="brand-avatar">E</div>
      <div className="searchbox"><Search size={19}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Token/US stocks/Perps"/></div>
      <button className="icon-btn"><Bell size={20}/></button>
    </header>

    <main className="content">
      <WalletHeader />
      <Promo />
      <Trending />
      <Ticker />

      <div className="tabs-row">
        {['Hot','Perps','Fomo','Meme','Hot Stocks'].map(t => <button key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t}</button>)}
        <button className="globe"><Globe2 size={20}/></button>
      </div>

      <div className="list-head"><span>Volume ↕ / Top ↕</span><span>Price&nbsp;&nbsp;&nbsp;&nbsp; Chg%</span></div>
      <section className="token-list">
        {filtered.map((token, i) => <TokenRow key={i} token={token} />)}
      </section>
    </main>

    <BottomNav page={page} setPage={setPage}/>
    <TradeButton />
  </div>
}

function WalletHeader(){
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const chainName = ({1:'Ethereum',8453:'Base',56:'BNB Chain'})[chainId] || 'Unknown network';
  const short = address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'elparadisogonzalo';
  const connectWallet = () => connect({ connector: connectors[0] });

  return <section className="wallet-area">
    <div className="wallet-name"><div className="eth-dot">◆</div><span>{isConnected ? short : 'elparadisogonzalo'}</span><ChevronDown size={15}/></div>
    <div className="balance">{isConnected && balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : '$1.253'}</div>
    <div className="pnl">Current PnL <strong>{isConnected ? 'Connected' : '$0'}</strong></div>
    <div className="wallet-actions">
      <button className="action"><Download size={22}/><span>Receive</span></button>
      <button className="action"><Gift size={22}/><span>Invite</span></button>
    </div>
    <div className="wallet-status">
      <span><span className={`status-dot ${isConnected?'on':''}`}></span>{isConnected ? chainName : 'Wallet not connected'}</span>
      {isConnected ? <button onClick={()=>disconnect()}>Disconnect</button> : <button onClick={connectWallet}>{isPending ? 'Connecting...' : 'Connect Wallet'}</button>}
    </div>
  </section>
}

function Promo(){ return <div className="promo"><div><div className="promo-small">ELPARADISOGONZALO · ON-CHAIN WEB3</div><h2>Your Web3 dashboard</h2><p>Track assets, connect your wallet and interact with your dApp.</p><button>Explore Web3 <ChevronRight size={16}/></button></div><div className="promo-orb"><Sparkles size={52}/></div></div> }

function Trending(){ return <div className="trending">{[
  ['Flap','+43.19%','🪙🌑'],['Pump.fun','+793.01%','⚪🔵'],['Robinhood','+1176.99%','🟢🟣']
].map(([a,b,c])=><div className="trend-card" key={a}><b>{a}</b><strong>{b}</strong><span>{c}</span><ChevronRight size={17}/></div>)}</div> }

function Ticker(){ return <div className="ticker">{[['₿','$83,178'],['◆','$2,564.5'],['◈','$769.24'],['◎','$115.57']].map(([a,b])=><div key={a}><i>{a}</i><strong>{b}</strong></div>)}</div> }

function TokenRow({token}){ return <article className="token-row"><div className="token-main"><div className="token-icon">{token.icon}</div><div><div className="token-title">{token.name} <span className="mini-fire">🔥</span></div><div className="token-meta">{token.volume} &nbsp; {token.cap}</div></div></div><div className="token-price"><strong>{token.price}</strong><span>{token.change}</span></div></article> }

function BottomNav({page,setPage}){ return <nav className="bottom-nav">{[['Home',Home],['Markets',LineChart],['Track',Activity],['Wallet',Wallet]].map(([label,Icon])=><button key={label} className={page===label?'selected':''} onClick={()=>setPage(label)}><Icon size={21}/><span>{label}</span></button>)}</nav> }
function TradeButton(){ return <button className="trade-fab" aria-label="Trade"><ArrowLeftRight size={27}/></button> }

function Root(){return <WagmiProvider config={config}><QueryClientProvider client={queryClient}><App/></QueryClientProvider></WagmiProvider>}
createRoot(document.getElementById('root')).render(<Root/>);
