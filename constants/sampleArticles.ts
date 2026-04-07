// constants/sampleArticles.ts
import { Article, Category } from '@/types/article';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Skin Health' },
  { id: '3', name: 'Lifestyle & Stress' },
  { id: '4', name: 'Nutrition & Diet' },
];

export const SAMPLE_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Understanding Your Skin Barrier',
    description:
      'Learn how to protect and strengthen your skin barrier for healthier, more resilient skin.',
    content: `<h2>What is the Skin Barrier?</h2>
    <p>The skin barrier, also known as the moisture barrier, is your skin's protective shield. It keeps good things in (like moisture) and bad things out (like bacteria and pollutants).</p>
    
    <h2>Why is it Important?</h2>
    <p>A healthy skin barrier is essential for:</p>
    <ul>
      <li>Maintaining hydration</li>
      <li>Protecting against environmental stressors</li>
      <li>Preventing irritation and sensitivity</li>
      <li>Supporting overall skin health</li>
    </ul>
    
    <h2>Signs of a Damaged Skin Barrier</h2>
    <ul>
      <li>Increased sensitivity</li>
      <li>Dry, flaky patches</li>
      <li>Redness and inflammation</li>
      <li>Breakouts and irritation</li>
      <li>Stinging sensation when applying products</li>
    </ul>
    
    <blockquote>
      <p>Your skin barrier is your first line of defense. Protect it, and it will protect you.</p>
    </blockquote>
    
    <h2>How to Repair Your Skin Barrier</h2>
    <ol>
      <li><strong>Simplify your routine</strong> - Use gentle, hydrating products</li>
      <li><strong>Avoid harsh ingredients</strong> - Skip exfoliants and strong actives</li>
      <li><strong>Add barrier-repairing ingredients</strong> - Look for ceramides, niacinamide, and fatty acids</li>
      <li><strong>Hydrate consistently</strong> - Use a good moisturizer twice daily</li>
      <li><strong>Protect with SPF</strong> - Sun damage weakens the barrier</li>
    </ol>
    
    <h2>Recommended Products</h2>
    <ul>
      <li>Gentle cream cleanser</li>
      <li>Hydrating serum with ceramides</li>
      <li>Rich moisturizer with fatty acids</li>
      <li>Mineral SPF 30 or higher</li>
    </ul>
    
    <p>Remember, repairing your skin barrier takes time. Be patient and consistent with your routine!</p>`,
    readTime: '3 min read',
    category: 'Skin Health',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    videoUrl: 'https://youtu.be/FVbTV1XyKCk?si=Tvifhdg93AgX7aTX',
    // author: 'Dr. Sarah Johnson',
    // publishedDate: '2024-01-15',
  },
  {
    id: '2',
    title: 'How Stress Affects Your Skin',
    description:
      'Discover the connection between stress and common skin issues like acne, eczema, and premature aging.',
    content: `<h2>The Mind-Skin Connection</h2>
    <p>Stress triggers a cascade of hormonal changes that directly impact your skin health. When you're stressed, your body produces cortisol, which can increase oil production and inflammation.</p>
    
    <h2>Common Stress-Related Skin Issues</h2>
    
    <h3>Acne Breakouts</h3>
    <p>Stress increases cortisol levels, which stimulates oil production and can lead to clogged pores and breakouts.</p>
    
    <h3>Eczema and Psoriasis Flares</h3>
    <p>Stress weakens the skin barrier and triggers inflammatory responses, making these conditions worse.</p>
    
    <h3>Premature Aging</h3>
    <p>Chronic stress accelerates the breakdown of collagen and elastin, leading to fine lines and wrinkles.</p>
    
    <h3>Dryness and Dehydration</h3>
    <p>Stress affects the skin's ability to retain moisture, leaving it dry and compromised.</p>
    
    <h2>Stress Management Techniques for Better Skin</h2>
    <ol>
      <li><strong>Mindfulness Meditation</strong> - 10 minutes daily can reduce cortisol levels</li>
      <li><strong>Regular Exercise</strong> - Improves circulation and reduces stress hormones</li>
      <li><strong>Quality Sleep</strong> - 7-9 hours allows skin to repair and regenerate</li>
      <li><strong>Deep Breathing</strong> - Activates the parasympathetic nervous system</li>
      <li><strong>Skincare Rituals</strong> - Turn your routine into a relaxing self-care practice</li>
    </ol>
    
    <h2>Skincare Tips for Stress-Prone Skin</h2>
    <ul>
      <li>Use calming ingredients like chamomile and green tea</li>
      <li>Avoid harsh exfoliants during high-stress periods</li>
      <li>Incorporate adaptogens like ashwagandha</li>
      <li>Keep your routine simple and consistent</li>
    </ul>
    
    <p><strong>Remember:</strong> Managing stress is just as important as your skincare products!</p>`,
    readTime: '4 min read',
    category: 'Lifestyle & Stress',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
    // author: 'Emma Thompson',
    // publishedDate: '2024-01-20',
  },
  {
    id: '3',
    title: 'Essential Nutrients for Glowing Skin',
    description:
      'The vitamins and minerals your skin needs to look its best, plus the best food sources.',
    content: `<h2>Essential Nutrients for Healthy Skin</h2>
    <p>What you eat directly affects your skin's appearance and health. Here are the key nutrients your skin needs:</p>
    
    <h3>Vitamin C</h3>
    <p>Essential for collagen production, vitamin C helps keep skin firm and youthful. Found in citrus fruits, berries, and bell peppers.</p>
    
    <h3>Vitamin E</h3>
    <p>A powerful antioxidant that protects skin from free radical damage. Found in nuts, seeds, and avocados.</p>
    
    <h3>Omega-3 Fatty Acids</h3>
    <p>Helps maintain skin's lipid barrier, keeping it hydrated and supple. Found in fatty fish, walnuts, and flaxseeds.</p>
    
    <h3>Zinc</h3>
    <p>Supports skin healing and reduces inflammation. Found in oysters, pumpkin seeds, and lentils.</p>
    
    <h2>Best Foods for Glowing Skin</h2>
    <ul>
      <li>Fatty fish (salmon, mackerel)</li>
      <li>Avocados</li>
      <li>Walnuts</li>
      <li>Sunflower seeds</li>
      <li>Sweet potatoes</li>
      <li>Bell peppers</li>
      <li>Broccoli</li>
      <li>Tomatoes</li>
      <li>Soy</li>
      <li>Dark chocolate</li>
    </ul>
    
    <p>Remember to stay hydrated by drinking plenty of water throughout the day!</p>`,
    readTime: '5 min read',
    category: 'Nutrition & Diet',
    imageUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=500',
    videoUrl: 'https://youtu.be/fk-VTgdPqAA?si=-eu0rQR68430jOu6',
    // author: 'Dr. Michael Chen',
    // publishedDate: '2024-01-18',
  },
  {
    id: '4',
    title: 'Morning Skincare Routine Guide',
    description:
      'Step-by-step guide to building an effective morning skincare routine for all skin types.',
    content: `<h2>The Perfect Morning Skincare Routine</h2>
    <p>A consistent morning routine sets the tone for your skin's health throughout the day. Here's your step-by-step guide:</p>
    
    <h3>Step 1: Gentle Cleanser</h3>
    <p>Start with a gentle, hydrating cleanser to remove overnight buildup without stripping your skin.</p>
    
    <h3>Step 2: Vitamin C Serum</h3>
    <p>Apply a vitamin C serum to protect against environmental damage and brighten your complexion.</p>
    
    <h3>Step 3: Moisturizer</h3>
    <p>Use a lightweight moisturizer to hydrate and prepare your skin for sunscreen.</p>
    
    <h3>Step 4: Sunscreen (SPF 30+)</h3>
    <p>The most important step! Apply broad-spectrum sunscreen as the final step in your morning routine.</p>
    
    <h2>Product Recommendations by Skin Type</h2>
    <ul>
      <li><strong>Oily skin:</strong> Gel-based cleanser, oil-free moisturizer, matte sunscreen</li>
      <li><strong>Dry skin:</strong> Cream cleanser, rich moisturizer, hydrating sunscreen</li>
      <li><strong>Sensitive skin:</strong> Fragrance-free products, mineral sunscreen</li>
      <li><strong>Combination skin:</strong> Balanced products that won't clog pores</li>
    </ul>
    
    <p>Remember to patch test new products and introduce them one at a time!</p>`,
    readTime: '3 min read',
    category: 'Skin Health',
    imageUrl: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500',
    // author: 'Sarah Wilson',
    // publishedDate: '2024-01-22',
  },
  {
    id: '5',
    title: 'Managing Stress Through Mindfulness',
    description: 'Simple mindfulness techniques to reduce stress and improve your skin health.',
    content: `<h2>Mindfulness for Better Skin Health</h2>
    <p>The mind-skin connection is powerful. Practicing mindfulness can reduce stress-related skin issues.</p>
    
    <h3>Simple Mindfulness Techniques</h3>
    <ul>
      <li><strong>Deep Breathing:</strong> Take 5 minutes each morning for deep, intentional breathing</li>
      <li><strong>Body Scan:</strong> Notice tension in your face and jaw, consciously relax these areas</li>
      <li><strong>Mindful Skincare:</strong> Turn your routine into a meditation by focusing on sensations</li>
      <li><strong>Gratitude Practice:</strong> Start your day by listing 3 things you're grateful for</li>
    </ul>
    
    <h2>5-Minute Morning Mindfulness Routine</h2>
    <ol>
      <li>Sit comfortably and close your eyes (1 minute)</li>
      <li>Take 10 deep breaths, focusing on the sensation of breathing (2 minutes)</li>
      <li>Scan your body from head to toe, releasing tension (1 minute)</li>
      <li>Set an intention for your day (1 minute)</li>
    </ol>
    
    <blockquote>
      <p>When you calm your mind, you calm your skin. Stress reduction is essential skincare.</p>
    </blockquote>
    
    <p>Consistency is key. Even 5 minutes of mindfulness daily can make a significant difference in your stress levels and skin health.</p>`,
    readTime: '6 min read',
    category: 'Lifestyle & Stress',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500',
    // author: 'Lisa Martinez',
    // publishedDate: '2024-01-25',
  },
  {
    id: '6',
    title: 'Anti-Inflammatory Diet for Skin',
    description: 'Foods that fight inflammation and promote clear, radiant skin.',
    content: `<h2>The Anti-Inflammatory Diet for Clear Skin</h2>
    <p>Chronic inflammation can lead to various skin issues including acne, eczema, and premature aging. An anti-inflammatory diet can help.</p>
    
    <h3>Foods to Eat</h3>
    <ul>
      <li>Leafy greens (spinach, kale)</li>
      <li>Fatty fish (salmon, sardines)</li>
      <li>Berries (blueberries, strawberries)</li>
      <li>Nuts and seeds (walnuts, chia seeds)</li>
      <li>Turmeric and ginger</li>
      <li>Green tea</li>
      <li>Olive oil</li>
    </ul>
    
    <h3>Foods to Avoid</h3>
    <ul>
      <li>Processed foods</li>
      <li>Sugar and artificial sweeteners</li>
      <li>Trans fats</li>
      <li>Excessive alcohol</li>
      <li>Dairy (for some individuals)</li>
    </ul>
    
    <h2>Sample Anti-Inflammatory Meal Plan</h2>
    <p><strong>Breakfast:</strong> Oatmeal with berries and walnuts</p>
    <p><strong>Lunch:</strong> Quinoa salad with leafy greens and salmon</p>
    <p><strong>Dinner:</strong> Grilled chicken with turmeric roasted vegetables</p>
    <p><strong>Snack:</strong> Green tea with a handful of almonds</p>
    
    <p>Give it 4-6 weeks to see noticeable improvements in your skin!</p>`,
    readTime: '4 min read',
    category: 'Nutrition & Diet',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
    videoUrl: 'https://youtu.be/FVbTV1XyKCk?si=Tvifhdg93AgX7aTX',
    // author: 'Dr. Rachel Green',
    // publishedDate: '2024-01-28',
  },
];
