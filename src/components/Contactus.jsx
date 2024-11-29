"use client";

import React, { useState } from "react";
import { Phone, Mail, Send, Loader2, Check } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export default function Component() {
  const [formState, setFormState] = useState({
    email: "",
    phone: "",
    name: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formState.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formState.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formState.message.trim()) {
      newErrors.message = "Message is required";
    }
    if (formState.phone && !formState.phone.match(/^\+?[\d\s-]{10,}$/)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: "",
          toEmail: 'gvehiclesinfo@gmail.com'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        // Reset form
        setFormState({ email: "", phone: "", name: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-black text-white font-['Playfair_Display'] pb-12">
      {/* Wavy Header Section */}
      <div className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-white mb-6">
            Get in Touch
          </h1>
          <div className="w-24 sm:w-32 h-1 bg-red-600 mx-auto transform transition-all duration-500 hover:w-40" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800/50">
              {submitStatus === "success" && (
                <Alert className="mb-6 bg-green-600/20 border-green-500 text-green-200">
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    Thank you for your message! We'll get back to you soon.
                  </AlertDescription>
                </Alert>
              )}

              {submitStatus === "error" && (
                <Alert className="mb-6 bg-red-600/20 border-red-500 text-red-200">
                  <AlertDescription>
                    Something went wrong. Please try again later.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className={`w-full p-4 rounded-2xl bg-zinc-800/50 backdrop-blur-sm border ${
                        errors.email ? "border-red-500" : "border-zinc-700"
                      } focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 placeholder-zinc-500`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm pl-2">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="tel"
                      name="phone"
                      value={formState.phone}
                      onChange={handleInputChange}
                      placeholder="Phone (optional)"
                      className={`w-full p-4 rounded-2xl bg-zinc-800/50 backdrop-blur-sm border ${
                        errors.phone ? "border-red-500" : "border-zinc-700"
                      } focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 placeholder-zinc-500`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm pl-2">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className={`w-full p-4 rounded-2xl bg-zinc-800/50 backdrop-blur-sm border ${
                      errors.name ? "border-red-500" : "border-zinc-700"
                    } focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 placeholder-zinc-500`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm pl-2">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Textarea
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    placeholder="Message"
                    rows={6}
                    className={`w-full p-4 rounded-2xl bg-zinc-800/50 backdrop-blur-sm border ${
                      errors.message ? "border-red-500" : "border-zinc-700"
                    } focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 resize-none placeholder-zinc-500`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm pl-2">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-8 py-4 bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Submit <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:h-fit">
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800/50 h-full">
              <h2 className="text-2xl font-bold mb-4">Our Newsletter</h2>
              <p className="text-zinc-400 mb-6">
                Stay updated with our latest vehicle history reports and
                industry insights. We send updates weekly.
              </p>
              <div className="space-y-4 ">
                <div className="relative">
                  <Mail className="relative left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-4 pl-12 rounded-2xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 placeholder-zinc-500"
                  />
                </div>
                <Button className="w-full px-6 py-4 bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2">
                  Subscribe
                </Button>
              </div>
            </div>
            <div className="w-[35vw] h-[35vh] -mt-10 relative ">
              <img
                src="https://wheelrecords.com/wp-content/uploads/brown-car.webp"
                alt="Brown car"
                className="hidden md:block w-full h-auto rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
