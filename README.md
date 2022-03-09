# Mail Project

This project is an email application that allow users to send and receive emails.

This project was built using Django as a backend framework and HTML CSS and JavaScript as frontend programming tools. All generated details are saved in a database, which is SQLite by default.

All webpages of the project are mobile-responsive.

#### Features of the project 
This project contains the features below where users can:
- send an email 
- reply to an email
- archive and unarchive an email
- view their inbox, sent mails and archived emails



#### Running the application
  - Install project dependencies by running `pip install -r requirements.txt`.
  - Make and apply migrations by running `python manage.py makemigrations` and `python manage.py migrate`.
  - Create superuser with `python manage.py createsuperuser`. This will create a user with admin privileges, with permissions to create, read, update and delete data in the Django admin
  - Run the django server using `python manage.py runserver` to enter the homepage of the web application.

#### Files and directories
  - `mail` - main application directory.
    - `static/mail` contains all static content.
        - `styles.css` contains compiled CSS file
        - `index.js` contains all the scripts that run in the templates
       
    - `templates/mail` contains all application templates.
        - `layout.html` - Base templates. Other templates extend it.
        - `register.html` -  Shows the register page for user to register for a new account
        - `login.html` -   Shows the login page for user to log in
        - `inbox.html` -  The homepage which displays all the different mailbox views
       
    - `admin.py` -admin settings for model view
    - `models.py` - contains the two models that I have used in the project- User and Email
    - `urls.py` - contains all application URLs.
    - `views.py`  contains all application views.

My project's video : https://www.youtube.com/watch?v=WSqcFUpDiY8
