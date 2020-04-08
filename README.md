
# GlideScope-ITS

Project GlideScope  untuk RS Dr. Soetomo Surabaya berbasis **Electron**. Didesain untuk single board computer **Raspberry Pi 3B** dan **Rasperry Pi 4** dengan resolusi layar **800x480**, menggunakan **kamera endoskopi** downscaled menjadi **480p** (mengikuti screen size) dengan codec **video/webm**.

# Instruksi
## Setup

Project ini memerlukan NPM. Silahkan install NPM terlebih dahulu jika belum terinstall. Disarankan menggunakan NVM untuk menginstall NPM.

Selanjutnya install **Electron** dan **Electron-Packager** secara global.

	npm i -g electron
	npm i -g electron-packager
	


## Run



    electron .

## Build

Untuk arsitektur dan OS yang sesuai dengan mesin yang sedang berjalan:

    electron-packager . GlideScope-ITS --electron-version 8.2.0

Untuk **Raspberry Pi 3B** (atau komputer armv7l-linux lainnya):

    electron-packager . GlideScope-ITS --electron-version 8.2.0 --arch armv7l --platform linux
Untuk **Raspberry Pi 4** (atau komputer arm64-linux lainnya):

    electron-packager . GlideScope-ITS --electron-version 8.2.0 --arch arm64 --platform linux
Output akan muncul pada folder **GlideScope-ITS-*{arsitektur}*-*{OS}*/** beserta binary yang bernama **GlideScope-ITS** yang bisa langsung dijalankan.
