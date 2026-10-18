/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Layout from "./components/layout/Layout";
import AuthGuard from "./components/AuthGuard";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";

const Home = lazy(() => import("./pages/Home"));
const Showcase = lazy(() => import("./pages/Showcase"));
const Careers = lazy(() => import("./pages/Careers"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RedirectPage = lazy(() => import("./pages/RedirectPage"));
const Support = lazy(() => import("./pages/Support"));
const GenericContentPage = lazy(() => import("./pages/GenericContentPage"));
const Posts = lazy(() => import("./pages/Posts"));
const PostDetail = lazy(() => import("./pages/PostDetail"));

const FallbackLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div 
      className="w-8 h-8 border-4 border-slate-900 border-t-transparent animate-spin rounded-full"
      style={{ borderRadius: "100%" }}
    ></div>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="posts" element={<Posts />} />
        <Route path="posts/:slug" element={<PostDetail />} />
        <Route path="news" element={<Posts />} />
        <Route path="news/:slug" element={<PostDetail />} />
        <Route path="showcase" element={<Showcase />} />
        <Route path="careers" element={<Careers />} />
        <Route path="support" element={<Support />} />
        <Route path="301" element={<RedirectPage />} />
        <Route path="redirect" element={<RedirectPage />} />
        
        {/* Generated pages from header links */}
        <Route path="products" element={<GenericContentPage />} />
        <Route path="products/enterprise" element={<GenericContentPage />} />
        <Route path="products/vulnerability-scanner" element={<GenericContentPage />} />
        <Route path="products/suite-editions" element={<GenericContentPage />} />
        <Route path="release-notes" element={<GenericContentPage />} />
        
        <Route path="customers/organizations" element={<GenericContentPage />} />
        <Route path="customers/testers" element={<GenericContentPage />} />
        <Route path="customers/developers" element={<GenericContentPage />} />
        
        <Route path="about" element={<GenericContentPage />} />
        <Route path="contact" element={<GenericContentPage />} />
        <Route path="legal" element={<GenericContentPage />} />
        <Route path="privacy" element={<GenericContentPage />} />
        <Route path="academy" element={<GenericContentPage />} />
        <Route path="research" element={<GenericContentPage />} />

        <Route path="solutions" element={<GenericContentPage />} />
        <Route path="solutions/manufacturing" element={<GenericContentPage />} />
        <Route path="solutions/retail" element={<GenericContentPage />} />
        <Route path="solutions/healthcare" element={<GenericContentPage />} />
        
        <Route path="resources" element={<GenericContentPage />} />
        <Route path="blog" element={<GenericContentPage />} />
        <Route path="case-studies" element={<GenericContentPage />} />
        <Route path="documentation" element={<GenericContentPage />} />
        <Route path="webinars" element={<GenericContentPage />} />
        
        <Route path="pricing" element={<GenericContentPage />} />

        {/* Home page internal links */}
        <Route path="learning-paths" element={<GenericContentPage />} />
        <Route path="learning-paths/:course" element={<GenericContentPage />} />
        <Route path="latest-topics" element={<GenericContentPage />} />
        <Route path="all-content" element={<GenericContentPage />} />
        <Route path="hall-of-fame" element={<GenericContentPage />} />
        <Route path="get-started" element={<GenericContentPage />} />
        <Route path="get-certified" element={<GenericContentPage />} />
        <Route path="learning-materials" element={<GenericContentPage />} />
        <Route path="labs" element={<GenericContentPage />} />
        <Route path="topics/:topic" element={<GenericContentPage />} />
        <Route path="events" element={<GenericContentPage />} />
        <Route path="store" element={<GenericContentPage />} />
        <Route path="demo" element={<GenericContentPage />} />
        <Route path="docs" element={<GenericContentPage />} />
      </Route>
      {/* Standalone routes outside of the main layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      } />
      <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsent />
    </Suspense>
  );
}
