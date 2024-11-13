# Sử dụng Node.js image
FROM node:14

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Biên dịch ứng dụng React (nếu bạn đang sử dụng React)
RUN npm run build

# Cài đặt server để phục vụ ứng dụng
RUN npm install -g serve

# Chạy ứng dụng
CMD ["serve", "-s", "build"]

# Mở cổng 3000
EXPOSE 3000