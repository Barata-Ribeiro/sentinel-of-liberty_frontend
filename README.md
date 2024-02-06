#  Sentinel of Liberty - Frontend
The website Sentinel of Liberty is built to be a place where users can suggest news from third-party news providers, and through this list, the interaction between the ecosystem starts. A User can freely write an article about said proposed news, focused on freedom and perhaps libertarian views. Not necessarily. It is a frontend to give a view to the backend it was built for; the project being completely open-source, you can modify it to your needs.  

###  Built With 🛠️  

-  [Angular](https://angular.io/)
-  [Angular SSR](https://angular.io/guide/ssr)
-  [Tailwind CSS](https://tailwindcss.com/)
- [Angular Toastr 🍞](https://github.com/scttcper/ngx-toastr)

###  Setup guide 🚀  

1.  Clone the repository using the following command:
	```bash
	git clone https://github.com/Barata-Ribeiro/sentinel-of-liberty_frontend.git
	```
2.  Navigate to folder:
	```bash
	cd sentinel-of-liberty_frontend
	```
3.  Install dependencies:
	```bash
	npm install
	```
4.  Running the frontend:
	```bash
	ng serve
	```
5. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Main Folder Structure 📂

```sh
.angular
.vscode
node_modules
src
├── app
│   ├── @types
│   ├── components
│   ├── guards
│   ├── pages
│   ├── services
│   ├── app.component.css
│   ├── app.component.html
│   ├── app.component.ts
│   ├── app.config.server.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── auth.interceptor.ts
├── assets
├── environments
├── custom-theme.scss
├── favicon.ico
├── index.html
├── main.server.ts
├── main.ts
└── styles.css
.editorconfig
.gitignore
.prettierignore
.prettierrc
angular.json
package-lock.json
package.json
postcss.config.cjs
README.md
server.ts
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.spec.json
```

### Contributing 🤝

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/Barata-Ribeiro/sentinel-of-liberty_frontend/issues) if you want to contribute.

### License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
