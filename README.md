# 🚀 ক্ষুদে ইঞ্জিনিয়ার একাডেমি (Khude Engineer Academy)

একটি অত্যাধুনিক ই-কমার্স ওয়েবসাইট যা রোবোটিক্স এবং ইলেক্ট্রনিক্স লার্নিং কিটস বিক্রয় ও প্রচারের জন্য তৈরি করা হয়েছে। 

## 🛠 টেকনোলজি স্ট্যাক (Tech Stack)

- **Frontend**: [Astro v5+](https://astro.build/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **CMS**: [Decap CMS](https://decapcms.org/) (পূর্বের Netlify CMS)
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 💻 লোকাল ডেভেলপমেন্ট (Local Development)

আপনি যখন আপনার কম্পিউটারে কাজ করবেন, তখন ওয়েবসাইট এবং অ্যাডমিন প্যানেল উভয়ই চালু করতে হবে।

### ১. ওয়েবসাইট চালু করা
```bash
npm run dev
```
এটি আপনার ওয়েবসাইটকে `http://localhost:4321` এ চালু করবে।

### ২. অ্যাডমিন প্যানেল (CMS) চালু করা
লোকাললি ফাইল এডিট করার জন্য আপনাকে একটি "Proxy Server" চালু করতে হবে:
```bash
npx decap-server
```
এখন আপনি `http://localhost:4321/admin/index.html` এ গিয়ে সরাসরি প্রোডাক্ট যোগ বা পরিবর্তন করতে পারবেন।

---

## ☁️ ক্লাউডফ্লেয়ার পেজেস ডিপ্লয়মেন্ট (Cloudflare Pages Deployment)

Cloudflare-এ প্রোজেক্টটি সেটআপ করার সময় এই সেটিংসগুলো ব্যবহার করুন:

- **Framework Preset**: `Astro`
- **Build Command**: `npm run build`
- **Build Output Directory**: `dist`
- **Node.js Version**: `22` বা তার বেশি।

---

## 🔐 ডেক্যাপ সিএমএস সিঙ্ক (Decap CMS & GitHub Auth)

Netlify-এর বাইরে (যেমন Cloudflare) Decap CMS ব্যবহার করলে GitHub এর সাথে কানেক্ট করার জন্য একটি OAuth Proxy প্রয়োজন হয়।

### ১. GitHub OAuth App তৈরি করুন
1. [GitHub Developer Settings](https://github.com/settings/developers) এ যান।
2. **New OAuth App** সিলেক্ট করুন।
3. **Authorization callback URL** হিসেবে আপনার ডোমেইন বা প্রক্সি URL দিন।

### ২. প্রক্সি সেটআপ (Cloudflare Workers)
Cloudflare-এ একটি ছোট **Worker** তৈরি করতে পারেন যা এই লগইনটি হ্যান্ডেল করবে। 
[decap-cms-cloudflare-oauth](https://github.com/vincerubinetti/decap-cms-cloudflare-oauth) - এই রিপোজিটরিটি ব্যবহার করে সহজে এটি সেটআপ করা সম্ভব।

### ৩. কনফিগারের পরিবর্তন
আপনার `public/admin/config.yml` ফাইলে নিচের অংশটুকু আপডেট করুন:
```yaml
backend:
  name: github
  repo: your-username/easyEcco # আপনার রিপোজিটরি নাম
  branch: main
  base_url: https://your-oauth-proxy.workers.dev # প্রক্সি URL
```

---

## 📦 কনটেন্ট ম্যানেজমেন্ট (Managing Content)

- **অ্যাডমিন ইউআরএল**: `your-site.com/admin/index.html`
- **লগইন**: GitHub একাউন্ট দিয়ে লগইন করে সহজেই প্রোডাক্টের নাম, দাম, ছবি এবং ক্যাটেগরি পরিবর্তন করা যায়।
- **ছবি আপলোড**: সব ছবি অটোমেটিক `public/images/products` ফোল্ডারে সেভ হবে।

---

## ⚙️ কাস্টমাইজেশন (Customization)

### প্রোডাক্ট পার পেজ (Products Per Page) পরিবর্তন
প্রতি পেজে কয়টি করে প্রোডাক্ট দেখাবে তা পরিবর্তন করতে নিচের ফাইলগুলোতে `pageSize` ভ্যালুটি আপডেট করুন:

1. **সব প্রোডাক্ট (১ম পেজ)**: `src/pages/products/index.astro` (লাইন ১২)
2. **সব প্রোডাক্ট (অন্যান্য পেজ)**: `src/pages/products/[page].astro` (লাইন ১৩)
3. **ক্যাটাগরি পেজ**: `src/pages/products/[category]/[...page].astro` (লাইন ২২ এবং ৩১)

> [!TIP]
> যেহেতু সাইটটি ৪-কলামের গ্রিড ব্যবহার করে, তাই সুন্দর দেখানোর জন্য ৪, ৮ বা ১২-এর গুণিতক সংখ্যা ব্যবহার করা ভালো।

---

---

## 📝 কন্টেন্ট পরিবর্তন (Changing Content)

ওয়েবসাইটের বিভিন্ন গুরুত্বপূর্ণ তথ্য পরিবর্তন করার নিয়ম নিচে দেওয়া হলো:

### ১. WhatsApp নম্বর পরিবর্তন
হোয়াটসঅ্যাপ নম্বরটি লজিক এবং ডিসপ্লে - উভয় জায়গাতেই পরিবর্তন করতে হবে।

- **লজিক (Redirects)**: 
    - `src/scripts/main.ts` (লাইন ৪): `const PHONE_NUMBER = "..."`
    - `src/pages/contact.astro` (লাইন ৮৬): `const PHONE_NUMBER = "..."`
- **ডিসপ্লে (UI Text)**: 
    - `src/pages/contact.astro` (লাইন ২৩): ফোন নম্বরটি লিখে দিন।
    - `src/components/Footer.astro` (লাইন ৫৮): ফোন নম্বরটি লিখে দিন।

### ২. হোম পেজ (Homepage) পরিবর্তন
হোম পেজের হিরো সেকশন, টাইটেল এবং অন্যান্য টেক্সট পরিবর্তন করতে:
- ফাইল: `src/pages/index.astro`

### ৩. সাইট টাইটেল এবং এসইও (SEO)
পুরো সাইটের ডিফল্ট টাইটেল এবং মেটা ডেসক্রিপশন পরিবর্তন করতে:
- ফাইল: `src/layouts/BaseLayout.astro` (লাইন ১২-১৯)

---

## 👨‍💻 কন্ট্রিবিউশন
আপনি যদি নতুন কোনো ফিচার যোগ করতে চান, তবে দয়া করে একটি পুল রিকোয়েস্ট (PR) পাঠান।

**ক্ষুদে ইঞ্জিনিয়ার একাডেমি - শেখার কোনো সীমা নেই!**
