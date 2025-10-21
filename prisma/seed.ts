import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding benchmark data...')

  // E-commerce - Food & Beverage
  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_food', metricName: 'ctr' } },
    update: {},
    create: {
      industry: 'ecommerce_food',
      metricName: 'ctr',
      minValue: 1.5,
      maxValue: 3.0,
      avgValue: 1.8,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_food', metricName: 'cpc' } },
    update: {},
    create: {
      industry: 'ecommerce_food',
      metricName: 'cpc',
      minValue: 0.80,
      maxValue: 2.50,
      avgValue: 1.20,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_food', metricName: 'cpm' } },
    update: {},
    create: {
      industry: 'ecommerce_food',
      metricName: 'cpm',
      minValue: 20.00,
      maxValue: 50.00,
      avgValue: 32.00,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_food', metricName: 'click_to_atc' } },
    update: {},
    create: {
      industry: 'ecommerce_food',
      metricName: 'click_to_atc',
      minValue: 8.0,
      maxValue: 12.0,
      avgValue: 10.0,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_food', metricName: 'atc_to_checkout' } },
    update: {},
    create: {
      industry: 'ecommerce_food',
      metricName: 'atc_to_checkout',
      minValue: 45.0,
      maxValue: 60.0,
      avgValue: 52.0,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_food', metricName: 'checkout_to_purchase' } },
    update: {},
    create: {
      industry: 'ecommerce_food',
      metricName: 'checkout_to_purchase',
      minValue: 60.0,
      maxValue: 75.0,
      avgValue: 67.0,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_food', metricName: 'atc_to_purchase' } },
    update: {},
    create: {
      industry: 'ecommerce_food',
      metricName: 'atc_to_purchase',
      minValue: 25.0,
      maxValue: 35.0,
      avgValue: 30.0,
      source: 'Industry aggregate 2024',
    },
  })

  // E-commerce - Fashion & Apparel
  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_fashion', metricName: 'ctr' } },
    update: {},
    create: {
      industry: 'ecommerce_fashion',
      metricName: 'ctr',
      minValue: 1.2,
      maxValue: 2.5,
      avgValue: 1.6,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_fashion', metricName: 'click_to_atc' } },
    update: {},
    create: {
      industry: 'ecommerce_fashion',
      metricName: 'click_to_atc',
      minValue: 6.0,
      maxValue: 10.0,
      avgValue: 8.0,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_fashion', metricName: 'atc_to_checkout' } },
    update: {},
    create: {
      industry: 'ecommerce_fashion',
      metricName: 'atc_to_checkout',
      minValue: 40.0,
      maxValue: 55.0,
      avgValue: 48.0,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_fashion', metricName: 'checkout_to_purchase' } },
    update: {},
    create: {
      industry: 'ecommerce_fashion',
      metricName: 'checkout_to_purchase',
      minValue: 55.0,
      maxValue: 70.0,
      avgValue: 62.0,
      source: 'Industry aggregate 2024',
    },
  })

  // E-commerce - Beauty & Cosmetics
  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_beauty', metricName: 'ctr' } },
    update: {},
    create: {
      industry: 'ecommerce_beauty',
      metricName: 'ctr',
      minValue: 1.3,
      maxValue: 2.8,
      avgValue: 1.9,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_beauty', metricName: 'click_to_atc' } },
    update: {},
    create: {
      industry: 'ecommerce_beauty',
      metricName: 'click_to_atc',
      minValue: 7.0,
      maxValue: 12.0,
      avgValue: 9.5,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_beauty', metricName: 'atc_to_checkout' } },
    update: {},
    create: {
      industry: 'ecommerce_beauty',
      metricName: 'atc_to_checkout',
      minValue: 42.0,
      maxValue: 58.0,
      avgValue: 50.0,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_beauty', metricName: 'checkout_to_purchase' } },
    update: {},
    create: {
      industry: 'ecommerce_beauty',
      metricName: 'checkout_to_purchase',
      minValue: 58.0,
      maxValue: 72.0,
      avgValue: 65.0,
      source: 'Industry aggregate 2024',
    },
  })

  // Generic E-commerce (fallback)
  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_general', metricName: 'ctr' } },
    update: {},
    create: {
      industry: 'ecommerce_general',
      metricName: 'ctr',
      minValue: 1.2,
      maxValue: 2.5,
      avgValue: 1.7,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_general', metricName: 'click_to_atc' } },
    update: {},
    create: {
      industry: 'ecommerce_general',
      metricName: 'click_to_atc',
      minValue: 7.0,
      maxValue: 11.0,
      avgValue: 9.0,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_general', metricName: 'atc_to_checkout' } },
    update: {},
    create: {
      industry: 'ecommerce_general',
      metricName: 'atc_to_checkout',
      minValue: 42.0,
      maxValue: 58.0,
      avgValue: 50.0,
      source: 'Industry aggregate 2024',
    },
  })

  await prisma.benchmark.upsert({
    where: { industry_metricName: { industry: 'ecommerce_general', metricName: 'checkout_to_purchase' } },
    update: {},
    create: {
      industry: 'ecommerce_general',
      metricName: 'checkout_to_purchase',
      minValue: 58.0,
      maxValue: 72.0,
      avgValue: 65.0,
      source: 'Industry aggregate 2024',
    },
  })

  console.log('Benchmark data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
