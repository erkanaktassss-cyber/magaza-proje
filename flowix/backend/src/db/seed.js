const db = require('./index');

db.prepare("INSERT OR IGNORE INTO users(username,password,role) VALUES('admin','1234','admin'),('kasiyer','1234','cashier')").run();
db.prepare("INSERT OR IGNORE INTO categories(id,name) VALUES (1,'İçecek'),(2,'Atıştırmalık')").run();
db.prepare("INSERT OR IGNORE INTO products(id,name,barcode,category_id,stock,cost_price,sale_price) VALUES (1,'Su 500ml','869000000001',1,120,3,6),(2,'Kola 1L','869000000002',1,70,18,30),(3,'Cips','869000000003',2,30,12,22)").run();
db.prepare("INSERT OR IGNORE INTO customers(id,name,phone,balance) VALUES (1,'Ahmet Yılmaz','05550001122',150),(2,'Merve Kaya','05550002233',-20)").run();
