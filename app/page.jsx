"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import {
  ShoppingCart,
  Heart,
  Star,
  Search,
  User,
  LogOut,
  Menu,
  Plus,
  Minus,
  Send,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

/*
====================================================================
TIENDA ONLINE PROFESIONAL - ZAPATOS Y ROPA
====================================================================

QUÉ INCLUYE ESTE ARCHIVO:
- Diseño moderno y visualmente potente
- Catálogo de productos con filtros y buscador
- Carrito de compra
- Favoritos
- Modal de producto
- Login y registro
- Reseñas reales guardadas en la nube
- Historial de pedidos guardado en la nube
- Formulario de contacto guardado en la nube
- Código MUY comentado para que entiendas cada parte

LO QUE SÍ PUEDE SER GRATIS:
- Frontend en Vercel
- Base de datos, login y guardado en Supabase Free
- Pedidos manuales guardados en la nube

LO QUE NO ES 100% GRATIS SI QUIERES COBRO REAL CON TARJETA:
- Stripe o cualquier pasarela cobra comisión por transacción

SOLUCIÓN GRATUITA REAL PARA EMPEZAR:
- Guardar pedidos en la nube como “pedido pendiente/manual”
- Luego cobras por Bizum, transferencia o WhatsApp

LO QUE TIENES QUE PONER TÚ AL FINAL:
- Tu URL y ANON KEY de Supabase
- Ejecutar el SQL que te dejo abajo
- Si quieres pagos reales con tarjeta: conectar Stripe
*/

/* ====================================================================
   1) CONFIGURACIÓN DE SUPABASE
   --------------------------------------------------------------------
   Aquí conectas la app con tu nube.
   Sustituye estos valores por los de tu proyecto de Supabase.
   ==================================================================== */
const supabaseUrl = "https://ljokvvbzsutvibbgacnm.supabase.co";
const supabaseAnonKey = "sb_publishable_oAqgwkl0JbQh59HdOdwOAg__psfAzny";

const isSupabaseConfigured =
  supabaseUrl.startsWith("https://") &&
  !supabaseUrl.includes("TU-PROYECTO") &&
  !supabaseAnonKey.includes("TU_SUPABASE_ANON_KEY");

const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/* ====================================================================
   2) CATÁLOGO DE DEMOSTRACIÓN
   --------------------------------------------------------------------
   Estos productos hacen que la tienda funcione nada más abrirla.
   Más adelante puedes moverlos a la base de datos.
   ==================================================================== */
const PRODUCTS = [
  {
    id: 1,
    name: "Nova Street Runner",
    category: "zapatos",
    gender: "unisex",
    price: 89.99,
    oldPrice: 119.99,
    rating: 4.8,
    reviewsCount: 128,
    badge: "Top ventas",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    description: "Sneaker urbana con diseño premium, gran agarre y comodidad diaria.",
    colors: ["Negro", "Blanco", "Rojo"],
    sizes: [38, 39, 40, 41, 42, 43, 44],
  },
  {
    id: 2,
    name: "Urban Flex Hoodie",
    category: "ropa",
    gender: "hombre",
    price: 54.99,
    oldPrice: 69.99,
    rating: 4.7,
    reviewsCount: 84,
    badge: "Nuevo",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    description: "Sudadera moderna, suave y perfecta para looks casual y deportivos.",
    colors: ["Gris", "Negro", "Beige"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "Elevate Leather Boots",
    category: "zapatos",
    gender: "mujer",
    price: 129.99,
    oldPrice: 159.99,
    rating: 4.9,
    reviewsCount: 62,
    badge: "Premium",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
    description: "Botín elegante con acabado premium y plantilla muy cómoda.",
    colors: ["Marrón", "Negro"],
    sizes: [36, 37, 38, 39, 40, 41],
  },
  {
    id: 4,
    name: "Essential Oversize Tee",
    category: "ropa",
    gender: "unisex",
    price: 29.99,
    oldPrice: 39.99,
    rating: 4.6,
    reviewsCount: 201,
    badge: "Oferta",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
    description: "Camiseta oversize con corte actual y tejido agradable al tacto.",
    colors: ["Blanco", "Negro", "Verde"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 5,
    name: "Aero Max Pulse",
    category: "zapatos",
    gender: "hombre",
    price: 99.99,
    oldPrice: 129.99,
    rating: 4.8,
    reviewsCount: 146,
    badge: "Running",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
    description: "Zapatilla deportiva con espuma reactiva y diseño muy atractivo.",
    colors: ["Azul", "Negro", "Blanco"],
    sizes: [39, 40, 41, 42, 43, 44, 45],
  },
  {
    id: 6,
    name: "Luna Chic Set",
    category: "ropa",
    gender: "mujer",
    price: 74.99,
    oldPrice: 94.99,
    rating: 4.9,
    reviewsCount: 77,
    badge: "Elegante",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    description: "Conjunto moderno para destacar con estilo en cualquier ocasión.",
    colors: ["Beige", "Negro", "Crema"],
    sizes: ["XS", "S", "M", "L"],
  },
];

/* ====================================================================
   3) RESEÑAS FIJAS DE MARCA
   --------------------------------------------------------------------
   Sirven para dar vida inicial a la tienda.
   Las reseñas reales se sumarán desde Supabase.
   ==================================================================== */
const STATIC_REVIEWS = [
  {
    id: "s1",
    author: "Lucía M.",
    rating: 5,
    comment: "La mejor tienda online que he probado. Diseño precioso y compra muy fácil.",
  },
  {
    id: "s2",
    author: "Carlos R.",
    rating: 5,
    comment: "La experiencia parece de marca grande. Muy profesional y fluida.",
  },
  {
    id: "s3",
    author: "Andrea S.",
    rating: 4,
    comment: "Me encantó el catálogo y el proceso de compra. Todo súper claro.",
  },
];

/* ====================================================================
   4) UTILIDADES PEQUEÑAS
   --------------------------------------------------------------------
   Funciones reutilizables para formatear dinero y estrellas.
   ==================================================================== */
function money(valor) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(valor);
}

function stars(rating) {
  return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
}

const initialContact = { name: "", email: "", phone: "", message: "" };
const initialAuth = { fullName: "", email: "", password: "" };
const initialReview = { product_id: "", rating: 5, comment: "" };

/* ====================================================================
   5) COMPONENTE PRINCIPAL
   --------------------------------------------------------------------
   Aquí vive toda la lógica visual y de negocio de la tienda.
   ==================================================================== */
export default function TiendaOnlineModaPro() {
  /* ------------------------------------------------------------------
     5.1) ESTADOS VISUALES
     ------------------------------------------------------------------ */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todos");
  const [gender, setGender] = useState("todos");
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notice, setNotice] = useState("");

  /* ------------------------------------------------------------------
     5.2) MODALES
     ------------------------------------------------------------------ */
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [checkoutType, setCheckoutType] = useState("manual");

  /* ------------------------------------------------------------------
     5.3) ESTADOS DE FORMULARIO
     ------------------------------------------------------------------ */
  const [contactForm, setContactForm] = useState(initialContact);
  const [authForm, setAuthForm] = useState(initialAuth);
  const [reviewForm, setReviewForm] = useState(initialReview);

  /* ------------------------------------------------------------------
     5.4) ESTADOS DE USUARIO / NUBE
     ------------------------------------------------------------------ */
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [cloudReviews, setCloudReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  /* ==================================================================
     6) PERSISTENCIA LOCAL DEL CARRITO Y FAVORITOS
     ------------------------------------------------------------------
     Esto guarda carrito y favoritos en el navegador.
     Así el usuario no pierde la selección al recargar.
     ================================================================== */
  useEffect(() => {
    const savedCart = localStorage.getItem("tienda-cart");
    const savedFavorites = localStorage.getItem("tienda-favorites");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  useEffect(() => {
    localStorage.setItem("tienda-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("tienda-favorites", JSON.stringify(favorites));
  }, [favorites]);

  /* ==================================================================
     7) SESIÓN DE USUARIO
     ------------------------------------------------------------------
     - Lee la sesión al cargar
     - Escucha login y logout
     - Si hay usuario, carga perfil, pedidos y reseñas
     ================================================================== */
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      setOrders([]);
      loadReviews();
      return;
    }

    loadProfile();
    loadOrders();
    loadReviews();
  }, [session]);

  /* ==================================================================
     8) CONSULTAS A LA NUBE
     ------------------------------------------------------------------
     Estas funciones leen datos desde Supabase.
     ================================================================== */
  async function loadProfile() {
    if (!supabase || !session?.user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", session.user.id)
      .single();

    if (!error && data) setProfile(data);
  }

  async function loadOrders() {
    if (!supabase || !session?.user) return;
    setLoadingOrders(true);

    const { data, error } = await supabase
      .from("orders")
      .select("id, created_at, status, total, subtotal, shipping, items, payment_method")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setOrders(data);
    setLoadingOrders(false);
  }

  async function loadReviews() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("reviews")
      .select("id, author_name, rating, comment, product_id, created_at")
      .order("created_at", { ascending: false })
      .limit(12);

    if (!error && data) setCloudReviews(data);
  }

  /* ==================================================================
     9) CÁLCULO DE PRODUCTOS FILTRADOS
     ------------------------------------------------------------------
     Buscador + filtros de categoría y género.
     ================================================================== */
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      const matchCategory = category === "todos" ? true : product.category === category;
      const matchGender = gender === "todos" ? true : product.gender === gender;

      return matchSearch && matchCategory && matchGender;
    });
  }, [search, category, gender]);

  /* ==================================================================
     10) TOTALES DEL CARRITO
     ------------------------------------------------------------------
     Aquí calculamos cantidades y precios.
     ================================================================== */
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 120 ? 0 : subtotal === 0 ? 0 : 4.99;
  const total = subtotal + shipping;

  /* ==================================================================
     11) RESEÑAS A MOSTRAR
     ------------------------------------------------------------------
     Mezclamos reseñas reales + reseñas fijas iniciales.
     ================================================================== */
  const reviewsToShow = [
    ...cloudReviews.map((r) => ({
      id: r.id,
      author: r.author_name,
      rating: r.rating,
      comment: r.comment,
    })),
    ...STATIC_REVIEWS,
  ].slice(0, 8);

  /* ==================================================================
     12) NOTIFICACIONES PEQUEÑAS
     ------------------------------------------------------------------
     Muestra mensajes rápidos al usuario.
     ================================================================== */
  function showNotice(message) {
    setNotice(message);
    setTimeout(() => setNotice(""), 2500);
  }

  /* ==================================================================
     13) FAVORITOS
     ------------------------------------------------------------------
     Añade o quita favoritos.
     ================================================================== */
  function toggleFavorite(productId) {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }

  /* ==================================================================
     14) CARRITO
     ------------------------------------------------------------------
     Lógica de añadir, quitar y actualizar productos.
     ================================================================== */
  function addToCart(product, size = product.sizes[0], color = product.colors[0]) {
    const cartKey = `${product.id}-${size}-${color}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...prev,
        {
          cartKey,
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          size,
          color,
          quantity: 1,
        },
      ];
    });

    showNotice(`${product.name} añadido al carrito`);
  }

  function updateQuantity(cartKey, delta) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(cartKey) {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  }

  /* ==================================================================
     15) REGISTRO
     ------------------------------------------------------------------
     Crea cuenta en Supabase Auth y guarda perfil.
     ================================================================== */
  async function handleRegister() {
    if (!supabase) {
      showNotice("Debes configurar Supabase para usar el registro");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: authForm.email,
      password: authForm.password,
      options: {
        data: {
          full_name: authForm.fullName,
        },
      },
    });

    if (error) {
      showNotice(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: authForm.email,
        full_name: authForm.fullName,
      });
    }

    setAuthForm(initialAuth);
    setIsAuthOpen(false);
    showNotice("Cuenta creada correctamente");
  }

  /* ==================================================================
     16) LOGIN
     ------------------------------------------------------------------
     Inicia sesión del usuario.
     ================================================================== */
  async function handleLogin() {
    if (!supabase) {
      showNotice("Debes configurar Supabase para usar el login");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: authForm.email,
      password: authForm.password,
    });

    if (error) {
      showNotice(error.message);
      return;
    }

    setAuthForm(initialAuth);
    setIsAuthOpen(false);
    showNotice("Sesión iniciada correctamente");
  }

  /* ==================================================================
     17) LOGOUT
     ------------------------------------------------------------------
     Cierra la sesión del usuario.
     ================================================================== */
  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    showNotice("Sesión cerrada");
  }

  /* ==================================================================
     18) CONTACTO
     ------------------------------------------------------------------
     Guarda mensajes de contacto en la nube.
     ================================================================== */
  async function submitContact(e) {
    e.preventDefault();

    if (!supabase) {
      showNotice("Configura Supabase para guardar mensajes");
      return;
    }

    const { error } = await supabase.from("contacts").insert({
      user_id: session?.user?.id ?? null,
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      message: contactForm.message,
    });

    if (error) {
      showNotice(error.message);
      return;
    }

    setContactForm(initialContact);
    showNotice("Mensaje enviado correctamente");
  }

  /* ==================================================================
     19) RESEÑAS
     ------------------------------------------------------------------
     Solo usuarios logueados pueden publicar reseñas reales.
     ================================================================== */
  async function submitReview(e) {
    e.preventDefault();

    if (!supabase || !session?.user) {
      showNotice("Debes iniciar sesión para dejar una reseña");
      return;
    }

    const product = PRODUCTS.find((p) => String(p.id) === String(reviewForm.product_id));

    if (!product) {
      showNotice("Selecciona un producto válido");
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      user_id: session.user.id,
      product_id: product.id,
      author_name: profile?.full_name || session.user.email || "Cliente",
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment,
    });

    if (error) {
      showNotice(error.message);
      return;
    }

    setReviewForm(initialReview);
    loadReviews();
    showNotice("Reseña publicada");
  }

  /* ==================================================================
     20) CHECKOUT GRATUITO REALISTA
     ------------------------------------------------------------------
     Este checkout crea un pedido real en la nube.
     - Modo manual: gratis de verdad
     - Modo tarjeta: requiere Stripe más adelante
     ================================================================== */
  async function handleCheckout() {
    if (cart.length === 0) {
      showNotice("Tu carrito está vacío");
      return;
    }

    if (!supabase || !session?.user) {
      showNotice("Debes iniciar sesión para comprar");
      return;
    }

    if (checkoutType === "manual") {
      const { error } = await supabase.from("orders").insert({
        user_id: session.user.id,
        status: "pendiente",
        subtotal,
        shipping,
        total,
        payment_method: "manual",
        items: cart,
      });

      if (error) {
        showNotice(error.message);
        return;
      }

      setCart([]);
      setIsCheckoutOpen(false);
      loadOrders();
      showNotice("Pedido creado y guardado en la nube");
      return;
    }

    showNotice("Para pagos con tarjeta debes conectar Stripe");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* ================================================================
          21) BARRA SUPERIOR
          ================================================================ */}
      <div className="border-b border-white/10 bg-white/5 py-2 text-center text-xs sm:text-sm">
        Envío gratis desde 120€ · Cambios sencillos · Diseño premium · Compra moderna
      </div>

      {/* ================================================================
          22) HEADER / NAVEGACIÓN
          ================================================================ */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white font-black text-black">
              TS
            </div>
            <div>
              <p className="text-lg font-bold tracking-wide">TTN STORE</p>
              <p className="text-xs text-white/55">Fashion & Sneakers</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#inicio" className="text-sm text-white/80 hover:text-white">Inicio</a>
            <a href="#catalogo" className="text-sm text-white/80 hover:text-white">Catálogo</a>
            <a href="#opiniones" className="text-sm text-white/80 hover:text-white">Reseñas</a>
            <a href="#contacto" className="text-sm text-white/80 hover:text-white">Contacto</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="rounded-2xl text-white hover:bg-white/10"
              onClick={() => setIsAuthOpen(true)}
            >
              <User className="mr-2 h-4 w-4" />
              {session?.user ? "Mi cuenta" : "Entrar"}
            </Button>

            <Button
              variant="ghost"
              className="relative rounded-2xl text-white hover:bg-white/10"
              onClick={() => setIsCheckoutOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                  {cartCount}
                </span>
              )}
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="rounded-2xl text-white hover:bg-white/10 md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-white/10 bg-neutral-950 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white">Menú</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  <a href="#inicio" className="text-white/80">Inicio</a>
                  <a href="#catalogo" className="text-white/80">Catálogo</a>
                  <a href="#opiniones" className="text-white/80">Reseñas</a>
                  <a href="#contacto" className="text-white/80">Contacto</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ================================================================
          23) HERO PRINCIPAL
          ================================================================ */}
      <section id="inicio" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_25%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <Badge className="mb-4 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-white">
              Tienda online premium de ropa y zapatos
            </Badge>
            <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              La web definitiva para vender <span className="text-white/70">moda, ropa y sneakers</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              Una experiencia visual potente, moderna y pensada para convertir mejor: catálogo atractivo,
              carrito fluido, login, reseñas, contacto y pedidos guardados en la nube.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                className="rounded-2xl bg-white px-6 py-6 text-black hover:bg-white/90"
                onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}
              >
                Comprar ahora <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl border-white/20 bg-transparent px-6 py-6 text-white hover:bg-white/10"
                onClick={() => document.getElementById("opiniones")?.scrollIntoView({ behavior: "smooth" })}
              >
                Ver reseñas
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InfoPill icon={Truck} title="Envío rápido" text="Base preparada para pedidos reales" />
              <InfoPill icon={ShieldCheck} title="Compra segura" text="Login y datos en la nube" />
              <InfoPill icon={RefreshCcw} title="Cambios fáciles" text="Experiencia pensada para convertir" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <Card className="overflow-hidden rounded-[2rem] border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80"
                alt="Moda premium"
                className="h-[500px] w-full object-cover"
              />
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          24) FILTROS Y BUSCADOR
          ================================================================ */}
      <section id="catalogo" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos, estilos, prendas..."
              className="h-12 rounded-2xl border-white/10 bg-black/30 pl-11 text-white placeholder:text-white/40"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              ["todos", "Todo"],
              ["zapatos", "Zapatos"],
              ["ropa", "Ropa"],
            ].map(([value, label]) => (
              <Button
                key={value}
                variant={category === value ? "default" : "outline"}
                className={`rounded-2xl ${
                  category === value
                    ? "bg-white text-black hover:bg-white/90"
                    : "border-white/20 bg-transparent text-white hover:bg-white/10"
                }`}
                onClick={() => setCategory(value)}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              ["todos", "Todos"],
              ["hombre", "Hombre"],
              ["mujer", "Mujer"],
              ["unisex", "Unisex"],
            ].map(([value, label]) => (
              <Button
                key={value}
                variant={gender === value ? "default" : "outline"}
                className={`rounded-2xl ${
                  gender === value
                    ? "bg-white text-black hover:bg-white/90"
                    : "border-white/20 bg-transparent text-white hover:bg-white/10"
                }`}
                onClick={() => setGender(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* ==============================================================
            25) GRID DE PRODUCTOS
            ============================================================== */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const isFavorite = favorites.includes(product.id);

            return (
              <motion.div key={product.id} layout whileHover={{ y: -6 }} transition={{ duration: 0.18 }}>
                <Card className="group overflow-hidden rounded-[2rem] border-white/10 bg-white/5 backdrop-blur-xl">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute left-4 top-4">
                      <Badge className="rounded-full bg-white text-black">{product.badge}</Badge>
                    </div>

                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:scale-105"
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? "fill-white" : ""}`} />
                    </button>
                  </div>

                  <CardContent className="p-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="text-xl font-bold">{product.name}</h3>
                      <span className="text-sm capitalize text-white/50">{product.category}</span>
                    </div>

                    <div className="mb-3 flex items-center gap-2 text-sm text-white/70">
                      <div className="flex items-center gap-1">
                        {renderStars(product.rating).map((filled, idx) => (
                          <Star key={idx} className={`h-4 w-4 ${filled ? "fill-white text-white" : "text-white/30"}`} />
                        ))}
                      </div>
                      <span>{product.rating}</span>
                      <span>({product.reviewsCount})</span>
                    </div>

                    <p className="mb-4 line-clamp-2 text-sm leading-6 text-white/65">{product.description}</p>

                    <div className="mb-5 flex items-end gap-3">
                      <span className="text-2xl font-black">{money(product.price)}</span>
                      <span className="text-sm text-white/35 line-through">{money(product.oldPrice)}</span>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        className="flex-1 rounded-2xl bg-white text-black hover:bg-white/90"
                        onClick={() => addToCart(product)}
                      >
                        Añadir al carrito
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================================================================
          26) BLOQUES DE CONFIANZA
          ================================================================ */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <FeatureCard title="Diseño de conversión" text="Jerarquía visual cuidada, CTAs fuertes y experiencia premium." />
        <FeatureCard title="Preparada para crecer" text="Lista para conectar base de datos, login y pagos reales." />
        <FeatureCard title="Guardado en la nube" text="Reseñas, pedidos, sesión y contacto con Supabase." />
      </section>

      {/* ================================================================
          27) RESEÑAS
          ================================================================ */}
      <section id="opiniones" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">Confianza</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Lo que opinan tus clientes</h2>
          </div>
          <p className="max-w-xl text-white/60">
            La tienda incluye reseñas visuales y puede guardar reseñas reales de clientes registrados.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {reviewsToShow.map((review) => (
            <Card key={review.id} className="rounded-[2rem] border-white/10 bg-white/5 p-1">
              <CardContent className="p-5">
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-white text-white" : "text-white/20"}`}
                    />
                  ))}
                </div>
                <p className="min-h-[90px] text-sm leading-6 text-white/75">“{review.comment}”</p>
                <p className="mt-4 font-semibold">{review.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Card className="rounded-[2rem] border-white/10 bg-white/5">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold">Dejar una reseña</h3>
              <p className="mt-2 text-sm text-white/60">Solo usuarios registrados pueden publicar reseñas reales.</p>
              <form className="mt-6 space-y-4" onSubmit={submitReview}>
                <select
                  value={reviewForm.product_id}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, product_id: e.target.value }))}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-white outline-none"
                >
                  <option value="">Selecciona un producto</option>
                  {PRODUCTS.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>

                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: e.target.value }))}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-white outline-none"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} estrellas</option>
                  ))}
                </select>

                <Textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                  placeholder="Cuéntanos tu experiencia..."
                  className="min-h-[140px] rounded-2xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
                />

                <Button className="rounded-2xl bg-white text-black hover:bg-white/90">
                  Publicar reseña
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/10 bg-white/5">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold">Tu cuenta y tus pedidos</h3>
              <p className="mt-2 text-sm text-white/60">
                Cuando el cliente inicia sesión, puede ver y recuperar sus compras guardadas.
              </p>
              <div className="mt-6 space-y-4">
                {session?.user ? (
                  <>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-sm text-white/50">Usuario</p>
                      <p className="font-semibold">{profile?.full_name || session.user.email}</p>
                      <p className="text-sm text-white/60">{session.user.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <Button
                    className="rounded-2xl bg-white text-black hover:bg-white/90"
                    onClick={() => setIsAuthOpen(true)}
                  >
                    Iniciar sesión o registrarse
                  </Button>
                )}

                <Separator className="bg-white/10" />

                <div>
                  <h4 className="mb-3 text-lg font-semibold">Últimos pedidos</h4>
                  {loadingOrders ? (
                    <p className="text-sm text-white/60">Cargando pedidos...</p>
                  ) : orders.length > 0 ? (
                    <div className="space-y-3">
                      {orders.slice(0, 4).map((order) => (
                        <div key={order.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium">Pedido #{String(order.id).slice(0, 8)}</span>
                            <Badge className="rounded-full bg-white text-black">{order.status}</Badge>
                          </div>
                          <p className="mt-2 text-sm text-white/60">
                            Método: {order.payment_method} · Total: {money(order.total)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/60">Todavía no hay pedidos guardados.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ================================================================
          28) CONTACTO
          ================================================================ */}
      <section id="contacto" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-[2rem] border-white/10 bg-white/5">
            <CardContent className="p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">Contacto</p>
              <h2 className="mt-2 text-3xl font-black">Habla con tu tienda</h2>
              <p className="mt-4 text-white/65">
                Guarda mensajes reales de clientes en la nube para consultas, soporte o ventas privadas.
              </p>

              <div className="mt-8 space-y-5">
                <ContactRow icon={Mail} label="Email" value="hola@ttnstore.com" />
                <ContactRow icon={Phone} label="Teléfono" value="+34 600 000 000" />
                <ContactRow icon={MapPin} label="Ubicación" value="Madrid, España" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/10 bg-white/5">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-2xl font-bold">Formulario de contacto</h3>
              <form className="mt-6 space-y-4" onSubmit={submitContact}>
                <Input
                  value={contactForm.name}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre completo"
                  className="h-12 rounded-2xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
                />
                <Input
                  value={contactForm.email}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Correo electrónico"
                  className="h-12 rounded-2xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
                />
                <Input
                  value={contactForm.phone}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Teléfono"
                  className="h-12 rounded-2xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
                />
                <Textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Escribe tu mensaje..."
                  className="min-h-[150px] rounded-2xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
                />
                <Button className="rounded-2xl bg-white text-black hover:bg-white/90">
                  <Send className="mr-2 h-4 w-4" /> Enviar mensaje
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ================================================================
          29) FOOTER
          ================================================================ */}
      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-white/45">
        © 2026 TTN STORE · Tienda online premium · Preparada para nube, login, pedidos y reseñas
      </footer>

      {/* ================================================================
          30) NOTIFICACIÓN FLOTANTE
          ================================================================ */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-white px-5 py-3 text-sm font-semibold text-black shadow-2xl"
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================
          31) MODAL DE PRODUCTO
          ================================================================ */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl border-white/10 bg-neutral-950 text-white">
          {selectedProduct && <ProductModal product={selectedProduct} onAdd={addToCart} />}
        </DialogContent>
      </Dialog>

      {/* ================================================================
          32) MODAL LOGIN / REGISTRO
          ================================================================ */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="max-w-lg border-white/10 bg-neutral-950 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Acceso de clientes</DialogTitle>
          </DialogHeader>

          <Tabs value={authMode} onValueChange={setAuthMode} className="mt-4">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-white/10">
              <TabsTrigger value="login" className="rounded-2xl">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="register" className="rounded-2xl">Crear cuenta</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4 space-y-4">
              <Input
                value={authForm.email}
                onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className="h-12 rounded-2xl border-white/10 bg-black/30 text-white"
              />
              <Input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Contraseña"
                className="h-12 rounded-2xl border-white/10 bg-black/30 text-white"
              />
              <Button className="w-full rounded-2xl bg-white text-black hover:bg-white/90" onClick={handleLogin}>
                Entrar
              </Button>
            </TabsContent>

            <TabsContent value="register" className="mt-4 space-y-4">
              <Input
                value={authForm.fullName}
                onChange={(e) => setAuthForm((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="Nombre completo"
                className="h-12 rounded-2xl border-white/10 bg-black/30 text-white"
              />
              <Input
                value={authForm.email}
                onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className="h-12 rounded-2xl border-white/10 bg-black/30 text-white"
              />
              <Input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Contraseña"
                className="h-12 rounded-2xl border-white/10 bg-black/30 text-white"
              />
              <Button className="w-full rounded-2xl bg-white text-black hover:bg-white/90" onClick={handleRegister}>
                Crear cuenta
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* ================================================================
          33) MODAL DE CARRITO / CHECKOUT
          ================================================================ */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-3xl border-white/10 bg-neutral-950 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Carrito y checkout</DialogTitle>
          </DialogHeader>

          <div className="mt-4 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              {cart.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-8 text-center text-white/60">
                  Tu carrito está vacío.
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.cartKey}
                      className="flex gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-4"
                    >
                      <img src={item.image} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="mt-1 text-sm text-white/55">
                              Talla: {item.size} · Color: {item.color}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.cartKey)}
                            className="text-sm text-white/50 hover:text-white"
                          >
                            Eliminar
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2 py-1">
                            <button onClick={() => updateQuantity(item.cartKey, -1)} className="p-1">
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-[24px] text-center text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartKey, 1)} className="p-1">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-lg font-bold">{money(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Card className="rounded-[2rem] border-white/10 bg-white/5">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">Resumen</h3>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/70">
                    <span>Envío</span>
                    <span>{shipping === 0 ? "Gratis" : money(shipping)}</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{money(total)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <label className="text-sm font-medium text-white/70">Método de compra</label>
                  <select
                    value={checkoutType}
                    onChange={(e) => setCheckoutType(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-white outline-none"
                  >
                    <option value="manual">Pedido manual gratuito</option>
                    <option value="card">Tarjeta (requiere Stripe)</option>
                  </select>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/65">
                  {checkoutType === "manual"
                    ? "Esta opción guarda el pedido en la nube sin cobrar online. Ideal para empezar gratis con transferencia, Bizum o pago acordado."
                    : "La estructura visual ya está lista, pero para cobrar con tarjeta debes conectar Stripe."}
                </div>

                <Button onClick={handleCheckout} className="mt-6 w-full rounded-2xl bg-white text-black hover:bg-white/90">
                  Finalizar compra
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ====================================================================
   34) COMPONENTES PEQUEÑOS REUTILIZABLES
   --------------------------------------------------------------------
   Mantienen el archivo más limpio y ordenado.
   ==================================================================== */
function InfoPill({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <Icon className="mb-3 h-5 w-5 text-white" />
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-white/60">{text}</p>
    </div>
  );
}

function FeatureCard({ title, text }) {
  return (
    <Card className="rounded-[2rem] border-white/10 bg-white/5">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-3 text-white/65">{text}</p>
      </CardContent>
    </Card>
  );
}

function ContactRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="rounded-xl bg-white p-2 text-black">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm text-white/50">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function ProductModal({ product, onAdd }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <img src={product.image} alt={product.name} className="h-full max-h-[520px] w-full rounded-[2rem] object-cover" />
      <div>
        <Badge className="mb-4 rounded-full bg-white text-black">{product.badge}</Badge>
        <h3 className="text-3xl font-black">{product.name}</h3>

        <div className="mt-3 flex items-center gap-2 text-white/70">
          {renderStars(product.rating).map((filled, idx) => (
            <Star key={idx} className={`h-4 w-4 ${filled ? "fill-white text-white" : "text-white/20"}`} />
          ))}
          <span>{product.rating}</span>
        </div>

        <p className="mt-5 text-white/70">{product.description}</p>

        <div className="mt-6 flex items-center gap-3">
          <span className="text-3xl font-black">{money(product.price)}</span>
          <span className="text-white/35 line-through">{money(product.oldPrice)}</span>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/60">Talla</label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-xl border px-4 py-2 text-sm ${
                    size === s ? "border-white bg-white text-black" : "border-white/20 bg-transparent text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">Color</label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`rounded-xl border px-4 py-2 text-sm ${
                    color === c ? "border-white bg-white text-black" : "border-white/20 bg-transparent text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={() => onAdd(product, size, color)} className="mt-8 rounded-2xl bg-white px-6 py-6 text-black hover:bg-white/90">
          Añadir al carrito
        </Button>
      </div>
    </div>
  );
}

/* ====================================================================
   35) SQL PARA SUPABASE
   --------------------------------------------------------------------
   COPIA ESTE BLOQUE EN EL SQL EDITOR DE SUPABASE.
   ====================================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists reviews (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  product_id bigint not null,
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz default now()
);

create table if not exists contacts (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz default now()
);

create table if not exists orders (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  status text default 'pendiente',
  subtotal numeric(10,2) not null default 0,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  payment_method text not null default 'manual',
  items jsonb not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table reviews enable row level security;
alter table contacts enable row level security;
alter table orders enable row level security;

create policy "users can read own profile"
on profiles for select
using (auth.uid() = id);

create policy "users can insert own profile"
on profiles for insert
with check (auth.uid() = id);

create policy "users can update own profile"
on profiles for update
using (auth.uid() = id);

create policy "anyone can read reviews"
on reviews for select
using (true);

create policy "authenticated users can create reviews"
on reviews for insert
to authenticated
with check (auth.uid() = user_id);

create policy "anyone can create contacts"
on contacts for insert
with check (true);

create policy "users can read own orders"
on orders for select
using (auth.uid() = user_id);

create policy "users can create own orders"
on orders for insert
to authenticated
with check (auth.uid() = user_id);

====================================================================
36) QUÉ TE FALTA PARA QUE FUNCIONE DE VERDAD
--------------------------------------------------------------------
OBLIGATORIO:
1. Crear proyecto en Supabase
2. Pegar este SQL
3. Poner tu supabaseUrl y supabaseAnonKey
4. Desplegar el frontend en Vercel

SI QUIERES COBRAR CON TARJETA:
5. Conectar Stripe
6. Crear backend o edge function para checkout
7. Añadir webhook para marcar pedidos como pagados

====================================================================
37) RESUMEN HONESTO
--------------------------------------------------------------------
YA TIENES AQUÍ:
- web moderna y profesional
- carrito
- favoritos
- catálogo
- filtros
- login/registro
- reseñas
- contacto
- pedidos en la nube
- historial de pedidos

PARA TENER PAGOS REALES ONLINE:
- debes añadir Stripe u otra pasarela
- eso no es completamente gratis porque cobran comisión
==================================================================== */