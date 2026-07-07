import { useEffect, useState } from "react";
import Navbar from "../../components/customer/Navbar";
import api from "../../api/axios";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import MapPicker from "../../components/customer/MapPicker";
import {
  searchAddress,
  reverseGeocode,
} from "../../services/locationService";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [position, setPosition] = useState(null);

    const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gcash_number: "",
    delivery_address: "",
    });
    const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
    });

    const [changingPassword, setChangingPassword] = useState(false);

    const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
    });

    useEffect(() => {
        loadProfile();
    }, []);

  async function loadProfile() {
    try {
      const { data } = await api.get("/user/profile");

      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        gcash_number: data.gcash_number || "",
        delivery_address: data.delivery_address || "",
      });
      if (data.latitude && data.longitude) {
        setPosition({
            lat: Number(data.latitude),
            lng: Number(data.longitude),
        });
        }
    } catch (err) {
      alert("Unable to load profile.");
    } finally {
      setLoading(false);
    }
}

  async function getCurrentLocation() {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported.");
    }

    navigator.geolocation.getCurrentPosition(
        (location) => {
        setPosition({
            lat: location.coords.latitude,
            lng: location.coords.longitude,
        });
        },
        () => {
        alert("Unable to get your location.");
        },
        {
        enableHighAccuracy: true,
        }
    );
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
    }));
}

  async function handleSave(e) {
    e.preventDefault();

    try {
        setSaving(true);

        const { data } = await api.put("/user/profile", {
            ...form,
            latitude: position?.lat,
            longitude: position?.lng,
            });

        setForm({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        gcash_number: data.user.gcash_number,
        delivery_address: data.user.delivery_address,
        });

        alert("✅ Profile updated successfully.");

    } catch (err) {
        alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
        setSaving(false);
    }
    }

  async function handlePasswordSubmit(e) {
    e.preventDefault();

    try {
        setChangingPassword(true);

        await api.put("/user/change-password", passwordForm);

        alert("✅ Password changed successfully.");

        setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
        });

    } catch (err) {
        alert(
        err.response?.data?.message ||
        "Unable to change password."
        );
    } finally {
        setChangingPassword(false);
    }
    }

    function handleChange(e) {
    setForm(prev => ({
    ...prev,
    [e.target.name]: e.target.value,
    }));
    }

    function handlePasswordChange(e) {
    setPasswordForm(prev => ({
    ...prev,
    [e.target.name]: e.target.value,
    }));
    }

    function togglePassword(field) {
    setShowPassword((prev) => ({
        ...prev,
        [field]: !prev[field],
    }));
    }

    const password = passwordForm.new_password;

    const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    };

    const strength = (() => {
    if (!password) {
        return {
        width: "0%",
        color: "bg-gray-300",
        text: "",
        };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1)
        return {
        width: "25%",
        color: "bg-red-500",
        text: "Weak",
        };

    if (score === 2)
        return {
        width: "50%",
        color: "bg-yellow-500",
        text: "Fair",
        };

    if (score === 3)
        return {
        width: "75%",
        color: "bg-blue-500",
        text: "Good",
        };

    return {
        width: "100%",
        color: "bg-green-500",
        text: "Strong",
    };
    })();


  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="p-10 text-center text-ngip-muted">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto px-5 py-8">

        <div className="mb-8">

            <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-sm text-ngip-muted hover:text-ngip-accent mb-5"
            >
                <ArrowLeft size={18}/>
                Back
            </button>

            <h1 className="font-display text-3xl font-bold">
                My Profile
            </h1>

            <p className="text-gray-500 dark:text-ngip-muted mt-2">
                Keep your account information up to date.
            </p>

            </div>

            <div className="bg-ngip-panel border border-white/5 rounded-3xl p-8 mb-8">

                <div className="flex items-center gap-6">

                    <div className="w-24 h-24 rounded-full bg-ngip-accent text-ngip-bg flex items-center justify-center text-4xl font-bold shadow-lg">
                        {form.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>

                        <h2 className="text-2xl font-bold">
                            {form.name || "Customer"}
                        </h2>

                        <p className="text-ngip-muted mt-1">
                            Manage your personal information.
                        </p>

                        <div className="mt-4 inline-flex px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm">
                            ✓ Verified Customer
                        </div>

                    </div>

                </div>

            </div>
        <form
          onSubmit={handleSave}
          className="bg-ngip-panel border border-white/5 rounded-3xl p-8 space-y-6"
        >

          <h2 className="font-semibold text-lg">
            Personal Information
          </h2>

          <div className="relative">

            <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ngip-muted"
            />

            <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-transparent
                    pl-12
                    pr-4
                    py-3
                    focus:border-ngip-accent
                    focus:outline-none
                "
            />

        </div>

        <div className="relative">

            <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ngip-muted"
            />

            <input
                name="email"
                value={form.email}
                disabled
                className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    pl-12
                    pr-4
                    py-3
                    text-ngip-muted
                    cursor-not-allowed
                "
            />

        </div>
        <p className="text-xs text-ngip-muted mt-2">
            Email cannot be changed.
        </p>

          <div className="relative">

            <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ngip-muted"
            />

            <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-transparent
                    pl-12
                    pr-4
                    py-3
                    focus:border-ngip-accent
                    focus:outline-none
                "
            />

        </div>

          <div className="relative">

            <CreditCard
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ngip-muted"
            />

            <input
                name="gcash_number"
                value={form.gcash_number}
                onChange={handleChange}
                className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-transparent
                    pl-12
                    pr-4
                    py-3
                    focus:border-ngip-accent
                    focus:outline-none
                "
            />

          </div>

          <div className="relative">

            <MapPin
                size={18}
                className="absolute left-4 top-4 text-ngip-muted"
            />

            <input
                name="delivery_address"
                value={form.delivery_address}
                onChange={handleChange}
                className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-transparent
                    pl-12
                    pr-32
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

        </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="font-medium">
                    Delivery Location
                </label>

                <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="
                        text-sm
                        px-4
                        py-2
                        rounded-lg
                        bg-ngip-accent
                        text-ngip-bg
                        hover:opacity-90
                    "
                >
                    📍 Use My Current Location
                </button>
            </div>

            <MapPicker
                position={position}
                setPosition={setPosition}
                onLocationChange={async (lat, lng) => {

                    const address = await reverseGeocode(
                        lat,
                        lng
                    );

                    setForm(prev => ({
                        ...prev,
                        delivery_address: address,
                    }));

                }}
            />

            <p className="text-xs text-ngip-muted">
                Click on the map to pin your exact delivery location.
            </p>

            </div>

          <button
            type="submit"
            disabled={saving}
            className="
                w-full
                py-4
                rounded-xl
                bg-ngip-accent
                text-ngip-bg
                font-bold
                text-lg
                hover:scale-[1.01]
                transition
                shadow-lg
                "
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

        </form>

        {/* Change Password Section */}
        <form
            onSubmit={handlePasswordSubmit}
            className="bg-ngip-panel border border-white/5 rounded-3xl p-8 mt-8"
            >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-ngip-accent/10 flex items-center justify-center">
                <ShieldCheck className="text-ngip-accent" size={22} />
                </div>

                <div>
                <h3 className="font-bold text-xl">
                    Password & Security
                </h3>

                <p className="text-sm text-ngip-muted">
                    Keep your account secure by changing your password regularly.
                </p>
                </div>
            </div>

            {/* Current Password */}
            <div className="relative mb-5">
                <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ngip-muted"
                />

                <input
                type={showPassword.current ? "text" : "password"}
                name="current_password"
                placeholder="Current Password"
                value={passwordForm.current_password}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-white/10 bg-transparent pl-12 pr-12 py-3 focus:border-ngip-accent focus:outline-none"
                />

                <button
                type="button"
                onClick={() => togglePassword("current")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ngip-muted"
                >
                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {/* New Password */}
            <div className="relative mb-5">
                <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ngip-muted"
                />

                <input
                type={showPassword.new ? "text" : "password"}
                name="new_password"
                placeholder="New Password"
                value={passwordForm.new_password}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-white/10 bg-transparent pl-12 pr-12 py-3 focus:border-ngip-accent focus:outline-none"
                />

                <button
                type="button"
                onClick={() => togglePassword("new")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ngip-muted"
                >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {/* Confirm Password */}
            <div className="relative mb-6">
                <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ngip-muted"
                />

                <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirm_password"
                placeholder="Confirm Password"
                value={passwordForm.confirm_password}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-white/10 bg-transparent pl-12 pr-12 py-3 focus:border-ngip-accent focus:outline-none"
                />

                <button
                type="button"
                onClick={() => togglePassword("confirm")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ngip-muted"
                >
                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {/* Password Strength */}
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                <span>Password Strength</span>

                <span className="font-semibold">
                    {strength === 0 && "Weak"}
                    {strength === 1 && "Weak"}
                    {strength === 2 && "Fair"}
                    {strength === 3 && "Good"}
                    {strength === 4 && "Strong"}
                </span>
                </div>

                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                    className={`h-full transition-all duration-300
                    ${
                    strength === 1
                        ? "w-1/4 bg-red-500"
                        : strength === 2
                        ? "w-2/4 bg-orange-500"
                        : strength === 3
                        ? "w-3/4 bg-yellow-500"
                        : strength === 4
                        ? "w-full bg-green-500"
                        : "w-0"
                    }`}
                />
                </div>
            </div>

            {/* Password Rules */}
            <div className="grid grid-cols-2 gap-3 mb-8 text-sm">

                <div className={passwordChecks.length ? "text-green-400" : "text-ngip-muted"}>
                {passwordChecks.length ? "✓" : "•"} Minimum 8 characters
                </div>

                <div className={passwordChecks.uppercase ? "text-green-400" : "text-ngip-muted"}>
                {passwordChecks.uppercase ? "✓" : "•"} Uppercase letter
                </div>

                <div className={passwordChecks.number ? "text-green-400" : "text-ngip-muted"}>
                {passwordChecks.number ? "✓" : "•"} Number
                </div>

                <div className={passwordChecks.special ? "text-green-400" : "text-ngip-muted"}>
                {passwordChecks.special ? "✓" : "•"} Special character
                </div>

            </div>

            {/* Save Button */}
            <button
                type="submit"
                disabled={changingPassword}
                className="w-full py-4 rounded-xl bg-ngip-accent text-ngip-bg font-bold text-lg hover:scale-[1.01] transition shadow-lg disabled:opacity-50"
            >
                {changingPassword
                ? "Updating Password..."
                : "Save New Password"}
            </button>
        </form>
      </div>
    </div>
  );
}