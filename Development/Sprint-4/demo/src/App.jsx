import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./pages/error-boundary/ErrorBoundary";
import AxiosConfiguration from "./AxiosConfiguration";
import {loadData} from './loaders/loadData'

const Homepage = lazy(() => import("./pages/shop/Homepage"));
const Landing = lazy(() => import("./pages/Landing/Landing"));
const ErrorPage = lazy(() => import("./pages/error-boundary/ErrorPage"));
const ShoppingCart = lazy(() => import("./pages/shop/ShoppingCart"));
const Checkout = lazy(() => import("./pages/shop/Checkout"));
const ProductPage = lazy(() => import("./pages/shop/ProductPage"));

const ShoppingCartSkeleton = lazy(() =>
  import("./pages/skeleton/ShoppingCartSkeleton")
);
const CheckoutSkeleton = lazy(() =>
  import("./pages/skeleton/CheckoutSkeleton")
);
const ProductPageSkeleton = lazy(() =>
  import("./pages/skeleton/ProductPageSkeleton")
);
const LandingSkeleton = lazy(() => import("./pages/skeleton/LandingSkeleton"));
const HomepageSkeleton = lazy(() =>
  import("./pages/skeleton/HomepageSkeleton")
);

const Error404 = lazy(()=>import("./pages/error-boundary/DNE"))

AxiosConfiguration()

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
      <Suspense fallback={<HomepageSkeleton/>}>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
                <Suspense fallback={<LandingSkeleton />}>
                    <Landing />
                </Suspense>
            }
          />
          <Route
            exact
            path="/homepage"
            element={
              <Suspense fallback={<HomepageSkeleton />}>
                <Homepage loader={loadData} />
              </Suspense>
            }

          />
          <Route
            exact
            path="/shopping-cart"
            element={
              <Suspense fallback={<ShoppingCartSkeleton />}>
                <ShoppingCart />
              </Suspense>
            }
          />
          <Route
            exact
            path="/checkout"
            element={
              <Suspense fallback={<CheckoutSkeleton />}>
                <Checkout />
              </Suspense>
            }
          />
          <Route
            exact
            path="/product-page"
            element={
              <Suspense fallback={<ProductPageSkeleton />}>
                <ProductPage />
              </Suspense>
            }
          />
          <Route
            exact
            path="/error-page"
            element={
              <Suspense fallback={<LandingSkeleton />}>
                <ErrorPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<LandingSkeleton />}>
                <Error404 />
              </Suspense>
            }
          />
        </Routes>
      </Router>
      </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
