Vue.component('button-counter', {
    props: ['cart_count'],
    data: function() {
        return {
            count: 0
        }
    },
    template: '<p>{{ cart_count }}</p>'
});

Vue.component('product-list', {
    props: ['product'],
    template: '<div class="card col-4">\n' +
        '                <img :src="product.image_src" class="card-img-top" alt="..." height="200" style="object-fit:cover;">\n' +
        '                <div class="card-body">\n' +
        '                    <div class="">\n' +
        '                        <h2> {{ product.product_name }}</h2>\n' +
        '                        <h6 v-if="product.product_stock > 0" class="d-flex justify-content-between"><span>Price: {{ product.price }}</span><span>Stock: {{ product.product_stock }}</span>\n' +
        '                        </h6>\n' +
        '                        <h6 v-else-if="product.product_stock == 0">Out of Stock</h6>\n' +
        '                    </div>\n' +
        '                    <div class="text-center">\n' +
        '                        <button type="button" v-if="product.product_stock == 0" class="btn btn-primary" disabled>Add to\n' +
        '                            cart\n' +
        '                        </button>\n' +
        '                        <button type="button" v-else-if="product.product_stock > 0" class="btn btn-primary"\n' +
        '                                v-on:click="$emit(\'add-cart-list\', index)">Add to cart\n' +
        '                        </button>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>'
});

Vue.component('blog-post', {
    props: ['post'],
    template: '<button v-on:click="$emit(\'enlarge-text\', 1)">CLick Me to increase Post font Size</button>',
    methods: {
    }
});

Vue.component('custom-input', {
    props: ['value'],
    template: '<input v-bind:value="value" v-on:input="$emit(\'input\', $event.target.value)">'
});

Vue.component('alert-box', {
    template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
  `
});

var app = new Vue({
    el: '#app',
    data: {
        postFontSize: 1,
        searchText: "",
        products: [
            {
                image_src: "images/guitar1.png",
                product_name: "Guitar 1",
                product_stock: 5,
                price: 1200
            },
            {
                image_src: "images/guitar2.jpg",
                product_name: "Guitar 2",
                product_stock: 4,
                price: 1400
            },
            {
                image_src: "images/guitar3.jpg",
                product_name: "Guitar 3",
                product_stock: 15,
                price: 2000
            },
            {
                image_src: "images/guitar4.webp",
                product_name: "Guitar 4",
                product_stock: 2,
                price: 1700
            }
        ],
        cart_count: 0,
        cartList: [],
        isButtonDisabled: false
    },
    /////////////////////////////////////////////////////////
    computed: {},
    ////////////////////////////////////////////////////////////
    methods: {
        addCartList: function (index) {
            console.log("a");
            this.cart_count += 1;
            this.cartList.push(this.products[index]);
            this.products[index].product_stock--;
        },
        removeFromCart: function (cartIndex) {
            var cartProduct = this.products.filter(product => product.product_name == this.cartList[cartIndex].product_name);
            this.products.forEach((element) => {
                if (element === cartProduct[0]) {
                    console.log(element);
                    element.product_stock++;
                }
            })
            this.cart_count -= 1;
            this.cartList.splice(cartIndex, 1);
        },
        saveToLocalStorage: function () {
            localStorage.setItem("cart_count", this.cart_count);
            localStorage.setItem("cartList", JSON.stringify(this.cartList));
        }
    }
})

var app2 = new Vue({
    el: '#app2',
    data: {
        cart_count: 0,
        cartList: [],
        shipping_charge: 100,
        subTotal: 0,
        total: 0
    },
    watch: {
        cartList: function (newSubTotal, oldSubTotal) {
            this.subTotal = 0;
            for (var cart of this.cartList) {
                this.subTotal = this.subTotal + cart.price;
            }
            this.total = this.subTotal + this.shipping_charge;
        }
    },
    mounted: function () {
        this.loadToVueInstance();
    },
    methods: {
        loadToVueInstance: function () {
            this.cart_count = localStorage.getItem("cart_count");
            this.cartList = JSON.parse(localStorage.getItem("cartList"));
            console.log(this.cartList);
            for (var cart of this.cartList) {
                this.subTotal = this.subTotal + cart.price;
            }
            this.total = this.subTotal + this.shipping_charge;
        },
        removeFromCart: function (cartIndex) {
            this.cartList.splice(cartIndex, 1);
            this.cart_count -= 1;
        }
    }
})

var app3 = new Vue({
    el: '#app3',
    data: {
        checkedSameAsShipping: false,
        cart_count: 0,
        payment_option: '',
        delivery_address: {
            shipping_address: {
                full_name: '',
                address: '',
                email: '',
                phone: ''
            },
            billing_address: {
                full_name: '',
                address: '',
                email: '',
                phone: ''
            }
        }
    },
    watch: {
        checkedSameAsShipping: function (newValue, oldValue) {
            if (newValue === true) {
                this.assignBillingAddress();
            } else if (newValue === false) {
                this.resetBillingAddress();
            }
        }
    },
    methods: {
        assignBillingAddress: function () {
            this.delivery_address.billing_address.full_name = this.delivery_address.shipping_address.full_name;
            this.delivery_address.billing_address.address = this.delivery_address.shipping_address.address;
            this.delivery_address.billing_address.email = this.delivery_address.shipping_address.email;
            this.delivery_address.billing_address.phone = this.delivery_address.shipping_address.phone;
        },
        resetBillingAddress: function () {
            this.delivery_address.billing_address.full_name = '';
            this.delivery_address.billing_address.address = '';
            this.delivery_address.billing_address.email = '';
            this.delivery_address.billing_address.phone = '';
        },
        submitAddress: function () {
            alert('a');
            localStorage.setItem("delivery_address", JSON.stringify(this.delivery_address));
            localStorage.setItem("payment_option", this.payment_option);
        }
    }
})