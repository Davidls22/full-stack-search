import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import SearchBar from "./components/SearchBar";
import Header from "./components/Header";
import useSearch from "./hooks/useSearch";
import Loading from "./components/Loading";

const ResultsList = lazy(() => import("./components/ResultsList"));
const SelectedItem = lazy(() => import("./components/SelectedItem"));

function App() {
  const { searchResults, fetchData, clearSearch, loading, query } = useSearch();

  return (
    <div className="container mt-3">
      <Header />
      <SearchBar onSearch={fetchData} onClear={clearSearch} />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<ResultsList results={searchResults} loading={loading} query={query} />} />
          <Route path="/:type/:id" element={<SelectedItem />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;