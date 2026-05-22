INSERT INTO users (full_name,email,password_hash,role) VALUES
('Admin Kullanıcı','admin@fabrika.local','$2a$10$o6Ls/lD0lTpwDOLL8qroQuz2nxlrFSmjyr3m8q9uQy12uqhsSzfJG','Admin'),
('Operatör Ali','operator@fabrika.local','$2a$10$o6Ls/lD0lTpwDOLL8qroQuz2nxlrFSmjyr3m8q9uQy12uqhsSzfJG','Operatör');

INSERT INTO production_lines (line_name,machine_name,status,current_product,shift,instant_count,target_count,scrap_count) VALUES
('Dolum Hattı 1','Mikser-01','Çalışıyor','Vişne Şurubu 1L','A',820,1000,18),
('Paketleme Hattı','Paketleyici-07','Duruşta','Nar Ekşisi 500ml','B',420,600,12);

INSERT INTO production_orders (product_name,product_code,lot_number,kazan_number,line_name,target_quantity,unit,packaging_type,start_date,shift,operator_id) VALUES
('Vişne Şurubu 1L','VS-1001','LOT-240522-A','KZ-3','Dolum Hattı 1',1200,'kg','12x1L Koli',CURRENT_DATE,'A',2);

INSERT INTO downtimes (line_id,start_time,end_time,reason,description,department,total_minutes) VALUES
(2, NOW() - INTERVAL '2 hour', NOW() - INTERVAL '1 hour', 'Sensör Arızası', 'Optik sensör resetlendi', 'Bakım', 60),
(2, NOW() - INTERVAL '5 hour', NOW() - INTERVAL '4 hour', 'Sensör Arızası', 'Tekrarlayan arıza', 'Bakım', 60);

INSERT INTO scrap_records (product_name,line_id,reason,quantity,description) VALUES
('Vişne Şurubu 1L',1,'Etiket Hatası',26,'Baskı kayması');

INSERT INTO lab_approvals (production_order_id,recipe_version,additive_decision,quality_result,approved,approved_at) VALUES
(1,'REC-1.4','İlave gerekmiyor','Uygun',true,NOW());

INSERT INTO inventory_moves (material_type,material_code,lot_number,pallet_no,shelf_code,quantity,unit,movement_type,moved_at) VALUES
('Hammadde','HM-CILEK-01','HM-LOT-001','PAL-102','A-03',750,'kg','GIRIS',NOW()),
('Bitmiş Ürün','UR-VS-1L','LOT-240522-A','PAL-340','C-12',120,'koli','CIKIS',NOW());

INSERT INTO maintenance_tickets (line_id,fault_code,description,intervention_minutes,responsible_team,created_at) VALUES
(2,'ARZ-778','Fotosel kablo gevşekliği',45,'Bakım',NOW());

INSERT INTO utility_readings (metric,value,unit,recorded_at) VALUES
('kuyu_suyu',120.4,'m3',NOW()),
('saf_su',87.2,'m3',NOW()),
('elektrik',1560.0,'kWh',NOW()),
('buhar',430.0,'kg',NOW());
