import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Layout from './Layout';
import Home from './pages/Home';
import Community from './pages/Community';
import Store from './pages/Store';
import Crates from './pages/Crates';
import Support from './pages/Support';
import CreateAnnouncement from './pages/CreateAnnouncement';
import NewsCollection from './pages/NewsCollection';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="community" element={<Community />} />
            <Route path="store" element={<Store />} />
            <Route path="crates" element={<Crates />} />
            <Route path="support" element={<Support />} />
            <Route path="create-announcement" element={<CreateAnnouncement />} />
            <Route path="news-collection" element={<NewsCollection />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
