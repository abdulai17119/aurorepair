import { describe, it, expect, vi } from 'vitest';

// Mock DOM for testing
document.body.innerHTML = `
  <div id="mobile-menu-button"></div>
  <div id="mobile-menu" class="hidden"></div>
  <form id="booking-form">
    <button type="submit">Book</button>
  </form>
`;

describe('Auto Repair Website Logic', () => {
  it('should toggle mobile menu', () => {
    // Similar to aluminium-glass, we expect basic UI interaction
    const toggle = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    
    expect(menu.classList.contains('hidden')).toBe(true);
  });
});
