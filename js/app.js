document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Robusta Brazil", img: "1.jpg", price: 20000 },
      { id: 2, name: "Arabica Blen", img: "2.jpg", price: 25000 },
      { id: 3, name: "primo Passo", img: "3.jpg", price: 30000 },
      { id: 4, name: "Aceh Gayo", img: "4.jpg", price: 35000 },
      { id: 5, name: "Sumatra Mandheling", img: "5.jpg", price: 40000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama di keranjang
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barangya sudah ada cek apakah barangnya beda atau sama di keranjang
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada tambah quantity dan subtotal
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // cek dulu item yang mau di remove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);
      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
          // jika bukan barang yang di klik
          if (item.id != id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        //jika barangnya 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true; // Tombol dinonaktifkan di awal

const form = document.querySelector("#checkout-form");

form.addEventListener("keyup", function () {
  let allFilled = true; // Variabel untuk mengecek apakah semua input sudah diisi

  for (let i = 0; i < form.elements.length; i++) {
    // Cek apakah elemen input memiliki nilai yang kosong
    if (form.elements[i].type !== "submit" && form.elements[i].value.trim() === "") {
      allFilled = false; // Jika ada yang kosong, set ke false
      break; // Keluar dari loop jika menemukan input kosong
    }
  }

  if (allFilled) {
    checkoutButton.disabled = false; // Aktifkan tombol jika semua input sudah diisi
    checkoutButton.classList.remove("disabled");
  } else {
    checkoutButton.disabled = true; // Nonaktifkan tombol jika ada input yang kosong
    checkoutButton.classList.add("disabled");
  }
});

// kirim data

checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  console.log(message);
  window.open("http://wa.me/6283874897599?text=" + encodeURIComponent(message));
});

// format pesan whatsapp
const formatMessage = (obj) => {
  var total = 0;
  JSON.parse(obj.items).map((item) => {
    console.log(item.total);
    total += item.total;
  });

  console.log(JSON.parse(obj.items));
  console.log(total);
  console.log(rupiah(total));
  // console.log(JSON.parse(obj.total));
  console.log(JSON.parse(obj.items).map((item) => rupiah(item.total)[0]));
  return `Data Customer
  Email: ${obj.email}
  Phone: ${obj.phone}
Data Pesanan
  Nama: ${obj.name}
${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
TOTAL: ${rupiah(total)}
Terima Kasih
  `;
};

// konversi mata uang ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
