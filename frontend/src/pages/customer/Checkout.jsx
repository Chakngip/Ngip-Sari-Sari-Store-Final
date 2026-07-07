import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/customer/Navbar.jsx';
import { useCart } from '../../context/CartContext.jsx';
import api from '../../api/axios';
import { useEffect } from "react";
import MapPicker from "../../components/customer/MapPicker";
import {
  searchAddress,
  reverseGeocode,
} from "../../services/locationService";
import { MapPin } from "lucide-react";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
  delivery_address: "",
  latitude: null,
  longitude: null,
  payment_method: "cod",
});

  const [position, setPosition] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
  loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data } = await api.get("/user/profile");

      setForm((prev) => ({
        ...prev,
        delivery_address: data.delivery_address || "",
        latitude: data.latitude,
        longitude: data.longitude,
      }));

      if (data.latitude && data.longitude) {
        setPosition({
          lat: Number(data.latitude),
          lng: Number(data.longitude),
        });
      }

    } catch (err) {
      console.error(err);
    }
  }
  async function findAddress() {
    if (!form.delivery_address.trim()) return;

    const result = await searchAddress(form.delivery_address);

    if (!result) {
      alert("Address not found.");
      return;
    }

    setPosition({
      lat: result.lat,
      lng: result.lng,
    });

    setForm((prev) => ({
      ...prev,
      delivery_address: result.address,
      latitude: result.lat,
      longitude: result.lng,
    }));
  }
  function getCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setPosition({
        lat,
        lng,
      });

      const address = await reverseGeocode(lat, lng);

      setForm((prev) => ({
        ...prev,
        delivery_address: address,
        latitude: lat,
        longitude: lng,
      }));
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        payment_method: form.payment_method,
        delivery_address: form.delivery_address,
        latitude: position?.lat || null,
        longitude: position?.lng || null,
      });
      clearCart();
      navigate(`/orders/${data.order.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-xl mx-auto px-5 py-16 text-center text-ngip-muted">
          Your cart is empty.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto px-5 py-8">
        <h1 className="font-display text-2xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="bg-ngip-panel border border-white/5 rounded-2xl p-6 space-y-4">
          {error && <div className="text-ngip-accent2 text-sm">{error}</div>}

          <div className="relative">

            <MapPin
                size={18}
                className="absolute left-4 top-4 text-ngip-muted"
            />

            <input
                value={form.delivery_address}
                onChange={(e)=>
                    setForm({
                        ...form,
                        delivery_address:e.target.value,
                    })
                }
                className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-transparent
                    pl-12
                    pr-28
                    py-3
                    focus:border-ngip-accent
                    focus:outline-none
                "
            />

            <button
                type="button"
                onClick={findAddress}
                className="
                    absolute
                    right-2
                    top-2
                    px-4
                    py-2
                    rounded-lg
                    bg-ngip-accent
                    text-ngip-bg
                    text-sm
                "
            >
                Find
            </button> 
            <div className="space-y-2 mt-4">

              <div className="flex justify-between items-center">

                  <label className="font-medium">
                      Delivery Location
                  </label>

                  <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="
                          px-4
                          py-2
                          rounded-lg
                          bg-ngip-accent
                          text-ngip-bg
                          text-sm
                      "
                  >
                      📍 Current Location
                  </button>

              </div>

              <MapPicker
                  position={position}
                  setPosition={setPosition}
                  onLocationChange={async (lat, lng) => {

                      setPosition({
                          lat,
                          lng,
                      });

                      const address = await reverseGeocode(lat, lng);

                      setForm(prev => ({
                          ...prev,
                          delivery_address: address,
                          latitude: lat,
                          longitude: lng,
                      }));

                  }}
              />

              <p className="text-xs text-ngip-muted">
                  Click or drag the marker to choose your delivery location.
              </p>

          </div>
                       
        </div>
        

          <div>
            <label className="block text-xs text-ngip-muted mb-1">Payment Method</label>
            <select
              value={form.payment_method}
                onChange={(e) =>
                  setForm({
                    ...form,
                    payment_method: e.target.value,
                  })
                }
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="gcash">GCash (pay upon confirmation)</option>
              <option value="maya">Maya (pay upon confirmation)</option>
            </select>
            <p className="text-xs text-ngip-muted mt-1">
              Online payment gateway integration is coming soon — for now GCash/Maya orders are confirmed manually by the store.
            </p>
          </div>

          <div className="border-t border-white/5 pt-4 flex items-center justify-between">
            <span className="text-ngip-muted text-sm">Order Total</span>
            <span className="font-display text-xl font-bold text-ngip-accent">₱{total.toFixed(2)}</span>
          </div>

          <button
            type="submit" disabled={submitting}
            className="w-full bg-ngip-accent text-ngip-bg font-semibold rounded-lg py-2.5 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Placing order…' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
