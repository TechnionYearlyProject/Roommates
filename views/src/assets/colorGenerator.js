export default function generateColor() {
    const color = Math.floor(Math.random() * 5);
    let accent = Math.floor(Math.random() * 5);
    accent = accent === 0 ? '' : `accent-${accent}`;
    switch (color) {
      case 0:
        return `red ${accent}`;
      case 1:
        return `blue ${accent}`;
      case 2:
        return `green ${accent}`;
      case 3:
        return `purple ${accent}`;
      case 4:
        return `orange ${accent}`;
      default:
        return '';
    }
  };