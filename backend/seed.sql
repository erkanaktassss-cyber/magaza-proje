INSERT INTO users (full_name,email,password_hash,role) VALUES
('Admin Kullanıcı','admin@fabrikaos.ai','demo','Admin'),
('Operatör Ali','operator@fabrikaos.ai','demo','Operatör');
INSERT INTO production_lines (line_name,machine_name,status,instant_count,target_count,scrap_count) VALUES
('Dolum Hattı 1','Mikser-01','çalışıyor',820,1000,18),
('Paketleme Hattı','Paketleyici-07','duruşta',420,600,12);
INSERT INTO downtimes (line_id,start_time,end_time,reason,description,department,total_minutes) VALUES
(2, NOW() - INTERVAL '2 hour', NOW() - INTERVAL '1 hour', 'Sensör Arızası', 'Optik sensör resetlendi', 'Bakım', 60),
(2, NOW() - INTERVAL '5 hour', NOW() - INTERVAL '4 hour', 'Sensör Arızası', 'Tekrarlayan arıza', 'Bakım', 60),
(2, NOW() - INTERVAL '8 hour', NOW() - INTERVAL '7 hour', 'Sensör Arızası', 'Kablo gevşekliği', 'Bakım', 60);
INSERT INTO scrap_records (product_name,line_id,reason,quantity,description) VALUES
('Vişne Şurubu 1L',1,'Etiket Hatası',26,'Baskı kayması');
