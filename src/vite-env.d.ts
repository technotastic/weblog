/// <reference types="vite/client" />

// Add definitions for non-standard HTML elements used in JSX
declare namespace JSX {
    interface IntrinsicElements {
        // Add marquee definition
        marquee: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
            behavior?: 'scroll' | 'slide' | 'alternate';
            direction?: 'left' | 'right' | 'up' | 'down';
            loop?: string | number;
            scrollamount?: string | number;
            scrolldelay?: string | number;
            truespeed?: boolean;
            // Add other specific marquee attributes if needed
        }, HTMLElement>;

        // Add tt definition
        tt: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

        // Add blink definition
        blink: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

        // You might not strictly need these if using camelCase props,
        // but doesn't hurt to be explicit if TS complains about table attributes
        table: React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement> & {
            cellpadding?: number | string;
            cellspacing?: number | string;
            border?: number | string; // If using border attribute directly
        }, HTMLTableElement>;

         td: React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableCellElement> & {
            valign?: "top" | "middle" | "bottom" | "baseline"; // Although CSS is preferred
            align?: "left" | "center" | "right" | "justify" | "char"; // Although CSS is preferred
        }, HTMLTableCellElement>;

        // Add other deprecated elements/attributes here if needed
    }
}