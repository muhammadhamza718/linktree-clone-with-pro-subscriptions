import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default themes
  const defaultThemes = [
    {
      name: 'Professional Blue',
      presetName: 'professional-blue',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      linkColor: '#3b82f6',
      buttonStyle: 'rounded',
      buttonColor: 'solid',
      isLightMode: true,
    },
    {
      name: 'Modern Dark',
      presetName: 'modern-dark',
      backgroundColor: '#111827',
      textColor: '#f9fafb',
      linkColor: '#60a5fa',
      buttonStyle: 'rounded',
      buttonColor: 'solid',
      isLightMode: false,
    },
    {
      name: 'Minimalist White',
      presetName: 'minimalist-white',
      backgroundColor: '#ffffff',
      textColor: '#111827',
      linkColor: '#000000',
      buttonStyle: 'square',
      buttonColor: 'solid',
      isLightMode: true,
    },
    {
      name: 'Creative Gradient',
      presetName: 'creative-gradient',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff',
      linkColor: '#ffffff',
      buttonStyle: 'pill',
      buttonColor: 'gradient',
      isLightMode: true,
    },
  ];

  for (const theme of defaultThemes) {
    await prisma.theme.upsert({
      where: { presetName: theme.presetName as string },
      update: {},
      create: theme,
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });