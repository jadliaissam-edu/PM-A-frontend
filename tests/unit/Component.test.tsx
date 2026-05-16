import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

function TestComponent({ title }: { title: string }) {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
}

test('renders TestComponent with provided title', () => {
  render(<TestComponent title="Hello RTL" />);
  expect(screen.getByText('Hello RTL')).toBeInTheDocument();
});
