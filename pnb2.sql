
/* address ---------one to many----------> user_details */
/* user_details ----------one to one-------- user_crdntl */
/* news_header ----------many to one---------> user_details */
/* news_header ----------many to one----------> address */
/* news_details ----------one to one----------> news_header */

show databases;
use pnb;
CREATE TABLE address (
 id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
 city VARCHAR(100),
 localities VARCHAR(255),
 state VARCHAR(100),
 pincode VARCHAR(6)
);

CREATE TABLE user_details(
id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
first_name VARCHAR(50),
last_name VARCHAR(50),
address_id INT,
phone VARCHAR(10) UNIQUE,
email VARCHAR(100) UNIQUE,
`TYPE` VARCHAR(3),
FOREIGN KEY(address_id) REFERENCES address(id)
);

CREATE INDEX idx_user_type ON user_details(TYPE);

CREATE TABLE user_crdntl(
id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
user_id INT ,
passwd VARCHAR(100),
FOREIGN KEY(user_id) REFERENCES user_details(id)
);

CREATE TABLE news_header(
id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
reporter_id INT ,
`date` DATETIME DEFAULT CURRENT_TIMESTAMP,
address_id INT ,
category VARCHAR(255),
FOREIGN KEY(reporter_id) REFERENCES user_details(id),
FOREIGN KEY(address_id) REFERENCES address(id)
);


CREATE TABLE news_details(
id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
header_id INT,
content TEXT,
headline TEXT(500),
report_ctr INT,
report_reason TEXT,
 FOREIGN KEY(header_id) REFERENCES news_header(id)
);

insert into address(city,localities,state,pincode) VALUES('Pune','Boatclub','Maha','411001');
select * from address;
insert into user_details(first_name,last_name,address_id,phone,email,TYPE) values('cyr','Sibs',(select id from address where pincode='411001'),'909090','abc@gmail.com','RED');
select * from user_details;
insert into user_crdntl (user_id,passwd) values ((select id from user_details where email='abc@gmail.com'),'12345');




