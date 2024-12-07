
type BaseProduct = {
    id: number;
    name: string;
    price: number;
    description: string; 
  };
  
  type Electronics = BaseProduct & {
    category: "electronics";
    brand: string;
    warranty: number; // у місяцях
  };
  
  type Clothing = BaseProduct & {
    category: "clothing";
    size: "S" | "M" | "L" | "XL";
    material: string;
  };
  
  type Book = BaseProduct & {
    category: "books";
    author: string;
    genre: string;
  };
  
  
  const findProduct = <T extends BaseProduct>(
    products: T[],
    id: number
  ): T | undefined => {
    return products.find((product) => product.id === id);
  };
  

  const filterByPrice = <T extends BaseProduct>(
    products: T[],
    maxPrice: number
  ): T[] => {
    return products.filter((product) => product.price <= maxPrice);
  };
  
  // Крок 3: Створення кошика
  
  // Тип для елемента кошика
  type CartItem<T> = {
    product: T;
    quantity: number;
  };
  
  // Функція для додавання товару в кошик
  const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
  ): CartItem<T>[] => {
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    return cart;
  };
  
  // Функція для підрахунку загальної вартості
  const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };
  
  // Крок 4: Використання функцій
  
  // Створення тестових даних
  const electronics: Electronics[] = [
    {
      id: 1,
      name: "Телефон",
      price: 10000,
      description: "Сучасний смартфон з великим екраном",
      category: "electronics",
      brand: "TechBrand",
      warranty: 24,
    },
    {
      id: 2,
      name: "Ноутбук",
      price: 25000,
      description: "Легкий і потужний ноутбук",
      category: "electronics",
      brand: "SuperLaptop",
      warranty: 36,
    },
  ];
  
  const clothing: Clothing[] = [
    {
      id: 3,
      name: "Футболка",
      price: 500,
      description: "Бавовняна футболка високої якості",
      category: "clothing",
      size: "M",
      material: "Cotton",
    },
    {
      id: 4,
      name: "Джинси",
      price: 1500,
      description: "Стильні та зручні джинси",
      category: "clothing",
      size: "L",
      material: "Denim",
    },
  ];
  
  const books: Book[] = [
    {
      id: 5,
      name: "1984",
      price: 300,
      description: "Класичний роман-антиутопія",
      category: "books",
      author: "Джордж Орвелл",
      genre: "Антиутопія",
    },
    {
      id: 6,
      name: "Мистецтво війни",
      price: 200,
      description: "Древній текст про стратегію та тактику",
      category: "books",
      author: "Сунь Цзи",
      genre: "Філософія",
    },
  ];
  
  // Тестування функцій
  // Пошук товару
  const phone = findProduct(electronics, 1);
  console.log("Знайдений товар:", phone);
  
  // Фільтрація товарів за ціною
  const affordableClothing = filterByPrice(clothing, 1000);
  console.log("Доступний одяг:", affordableClothing);
  
  // Робота з кошиком
  let cart: CartItem<BaseProduct>[] = [];
  if (phone) cart = addToCart(cart, phone, 2); // Додати телефон у кількості 2
  const jeans = findProduct(clothing, 4);
  if (jeans) cart = addToCart(cart, jeans, 1); // Додати джинси
  
  console.log("Кошик після додавання товарів:", cart);
  
  // Підрахунок загальної вартості
  const total = calculateTotal(cart);
  console.log("Загальна вартість кошика:", total);
  