import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BrowseMore } from './browsemore';
import { Chat } from './chat';
import { KostDetail } from './kostdetail';
import { CompareKost } from './compare';
import { Sidebar } from './sidebar';
import { Home } from './home';
import { Financial } from './financial';
import { Onboarding } from './onboarding';

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<BrowseMore />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/financial" element={<Financial />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/kost/:id" element={<KostDetail />} />
        <Route path="/compare/:id1/:id2" element={<CompareKost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
