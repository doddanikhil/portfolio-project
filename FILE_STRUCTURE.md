### Project File Structure

```
/Users/nd/Documents/portfolio-project
├── backend
│   ├── build.sh
│   ├── manage.py
│   ├── minimal_data.py
│   ├── portfolio_backend
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── blog
│   │   │   ├── admin.py
│   │   │   ├── migrations
│   │   │   │   ├── __init__.py
│   │   │   │   ├── 0001_initial.py
│   │   │   │   └── 0002_contactsubmission_blogpost_is_featured_and_more.py
│   │   │   ├── models.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   ├── core
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── migrations
│   │   │   │   ├── __init__.py
│   │   │   │   ├── 0001_initial.py
│   │   │   │   └── 0002_add_bluesky_and_preferences.py
│   │   │   ├── models.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── projects
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── migrations
│   │   │   ├── __init__.py
│   │   │   ├── 0001_initial.py
│   │   │   └── 0002_siteconfiguration_alter_techcategory_options_and_more.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── quick_setup.py
│   ├── render.yaml
│   ├── requirements.txt
│   ├── test_deployment.py
│   └── use_core_models.py
├── frontend
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── postcss.config.mjs
│   ├── public
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── README.md
│   ├── src
│   │   ├── app
│   │   │   ├── about
│   │   │   │   └── page.tsx
│   │   │   ├── blog
│   │   │   │   ├── [slug]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── connect
│   │   │   │   └── page.tsx
│   │   │   ├── contact
│   │   │   │   └── page.tsx
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── projects
│   │   │       └── page.tsx
│   │   ├── components
│   │   │   ├── layout
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Navigation.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── sections
│   │   │   │   └── HeroSection.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   └── ui
│   │   │       ├── AnimatedBackground.tsx
│   │   │       ├── GlobalBackground.tsx
│   │   │       └── ThemeToggle.tsx
│   │   ├── lib
│   │   │   ├── api.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   └── projects
│   │       └── page.tsx
│   ├── tailwind.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vercel.json
├── README.md
└── FILE_STRUCTURE.md
```
