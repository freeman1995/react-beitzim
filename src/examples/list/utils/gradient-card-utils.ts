export type GradientCard = {
  id: string;
  background: string;
  size: number;
  isNew?: boolean;
  isRemoved?: boolean;
};

const generatePrimaryColor = () => Math.floor(Math.random() * 255);

const generateColor = () =>
  `rgb(${generatePrimaryColor()}, ${generatePrimaryColor()}, ${generatePrimaryColor()})`;

export const generateGradientCard = (): GradientCard => ({
  id: Math.random().toString(32),
  size: Math.max(200, Math.floor(400 * Math.random())),
  background: `linear-gradient(135deg, ${generateColor()} 0%, ${generateColor()} 100%)`
});
