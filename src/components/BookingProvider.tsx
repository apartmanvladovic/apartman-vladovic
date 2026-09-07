"use client";

import { createContext, useContext, useState } from "react";

interface BookingRange {
  checkIn: string; // YYYY-MM-DD ili ""
  checkOut: string;
  setRange: (checkIn: string, checkOut: string) => void;
}

const BookingContext = createContext<BookingRange>({
  checkIn: "",
  checkOut: "",
  setRange: () => {},
});

export function useBookingRange(): BookingRange {
  return useContext(BookingContext);
}

/**
 * Dijeli odabrani termin (kalendar → kontakt forma) između sekcija.
 */
export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState({ checkIn: "", checkOut: "" });

  return (
    <BookingContext.Provider
      value={{
        checkIn: range.checkIn,
        checkOut: range.checkOut,
        setRange: (checkIn, checkOut) => setRange({ checkIn, checkOut }),
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}
