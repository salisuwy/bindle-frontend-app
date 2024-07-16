# README

Vue3 + Vite + Tailwind

It's an SPA.

### Installing:
```
npm install
```

### Development:
```
npm run dev
```

### Build for deployment:
```
npm run 
```

## Deploy

### Staging
* Deployment is old school FTP upload:
> Username: frontend-ftp@bindle.co.uk  
> Password: 8CUh7A498xzc6uw
After building the app simply upload the contents of /dist

* this then makes the site available at https://frontend.bindle.co.uk where it is password protected via Basic 
Authentication (to prevent bots crawling it, not for security!):  
>  Username: newicon  
>  Password: newicon  

### Production
> todo : production deployment is not yet available

## Bindle API
Homepage:
GET https://stage.bindle.co.uk/api

Exam boards:
GET https://stage.bindle.co.uk/api/examboards
GET https://stage.bindle.co.uk/api/examboards/{id}

Subjects:
GET https://stage.bindle.co.uk/api/subjects
GET https://stage.bindle.co.uk/api/subjects/{id}

Levels:
GET https://stage.bindle.co.uk/api/levels
GET https://stage.bindle.co.uk/api/levels/{id}

Discounts:
GET https://stage.bindle.co.uk/api/discounts
GET https://stage.bindle.co.uk/api/discounts/{id}

Bindles:
GET https://stage.bindle.co.uk/api/bindles
GET https://stage.bindle.co.uk/api/bindles/{id}

Books:
GET https://stage.bindle.co.uk/api/books
GET https://stage.bindle.co.uk/api/books/{id}
GET https://stage.bindle.co.uk/api/books?query={query}

## /src/store/bindle-api.js
the API was designed and implemented in a general purpose manner, but it is only consumed by the website which has a 
fairly different use case : it requires info such as subjects/level/examboards for every single page (for the menu)
- since the books API was throwing a 500 at the time when I didn't have access to the code, the books are derived via 
other API calls pivot data, apologies for this rather unintuitive setup.
