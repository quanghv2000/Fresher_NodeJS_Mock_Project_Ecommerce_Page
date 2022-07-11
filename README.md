# Ec Mockproj Ecommerce



## Getting started

Project2 in EC,Please clone this repo and show us your development progress via a commit and merge request.

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/tuandoan2604/ec-mockproj-ecommerce.git
git branch -M main
git push -uf origin main
```

## Requirement

	1. Support user registration function, login is required to make shopping.
	2. The first page will display the goods. After logging in, the user will authenticate the email to continue purchasing and rating.
	3. On the second login, there will be no need to log in with email and password. Click Sign Out to log back in.
	4. The item displays basic information such as name, review, price, and remaining quantity.
	5. Choose to buy products and show the list of products in the cart. Calculate the total amount and save the invoice information.
	6. Use Token Based Authentication with access token, refresh token.
	7. Write Middleware for Authentication/Authorization actions. Admin can add, remove users, products, quantity of products.
	8. Upload file Image, Video of Product, User Infor (Through 3rd party or directly to the server).
	9. Implement audit log for all actions.
    10. Unit Test

## II, Tools (Optional)

	1. NestJS (Typescript)
	2. Middleware (Authen, Author, Validate data, Error Handle). Authen Author by JWT (Json Web Token)
	3. Database PostGreSQL (use ORM Sequelize)
	4. Audit log by winston
	5. Swagger UI for Docs API 
    6. ESLint/TSLint (static typing, coding convention, strict)
    7. Redis (Caching Data)
    8. Unit test (Jest/...)

## IV, Write a concise README

	How to run your code locally?
	A sample “curl” command to call your API
	How to run your unit tests locally?
	What do you love about your solution?
	What else do you want us to know about however you do not have enough time to complete?


## Notes
We recommend using Express JS, PostgreSQL. However, we encourage you to use the programming language that you are most comfortable with because we want you to shine with all your skills and knowledge.