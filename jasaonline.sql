CREATE DATABASE IF NOT EXISTS db_jasa_online;

USE db_jasa_online;

CREATE TABLE IF NOT EXISTS users(
    id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nama varchar(50) NOT NULL,
    tanggal_lahir varchar(50),
    jenis_kelamin varchar(50),
    nomor_hp varchar(20),
    alamat varchar(255),
    email varchar(50) NOT NULL,
    password text NOT NULL
);

CREATE TABLE IF NOT EXISTS jasa(
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id int NOT NULL,
    nama_jasa varchar(50) NOT NULL,
    deskripsi_singkat varchar(255) NOT NULL,
    uraian_deskripsi text,
    rating int,
    gambar varchar(100) NOT NULL,
    CONSTRAINT PK_USER_ID FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO users(nama, tanggal_lahir, jenis_kelamin, nomor_hp, alamat, email, password) VALUES
('Anton','1 Januari 2020', 'Pria', '081211111111', 'Jl. Damai', 'anton@gmail.com', 'tes12345'),
('Budi','2 Januari 2020', 'Pria', '081222222222', 'Jl. Sentosa', 'budi@gmail.com', 'tes12345'),
('Cut Monika','3 Januari 2020', 'Wanita', '081233333333', 'Jl. Makmur', 'cut@gmail.com', 'tes12345');

INSERT INTO jasa(user_id, nama_jasa, deskripsi_singkat, uraian_deskripsi, rating, gambar) VALUES
(1,'Service AC Barokah', 'Service segala merk AC', 'Rumah atau kantor hajar', 0,'test3.jpg'),
(3,'Tukang Pipa Hidayah', 'Memperbaiki segala pipa yang bocor', 'Rumah atau kantor siap', 0, 'test2.jpg'),
(3,'Tukang Rumah', 'Buat rumah ukuran apa saja', 'Rumah kayu dan batu lewat', 0, 'test3.jpg');