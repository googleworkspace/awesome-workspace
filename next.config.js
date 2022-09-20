/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const PRODUCTION = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: PRODUCTION ? "/awesome-workspace" : "/",
  // https://github.com/vercel/next.js/issues/38984 for undefined instead of "/"
  basePath: PRODUCTION ? "/awesome-workspace" : undefined,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["fonts.gstatic.com"],    
    disableStaticImages: true,
  },
  experimental: {
    images: {
      unoptimized: true,
    },
    
  },
  

};

module.exports = nextConfig;
