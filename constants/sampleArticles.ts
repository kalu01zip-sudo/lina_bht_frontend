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
    content: `
      <div class="info">
        <strong>⚡ Quick Fact:</strong> Your skin barrier is only as thick as a sheet of paper!
      </div>

      <p>Your skin barrier, also known as the moisture barrier, is your skin's protective shield. It keeps good things in (like moisture) and bad things out (like bacteria and pollutants).</p>

      <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800" alt="Diagram of healthy skin barrier structure" />

      <div class="tip">
        <strong>💡 Daily Barrier Protection Tips:</strong>
        <ul>
          <li>Use lukewarm water, not hot</li>
          <li>Pat dry, don't rub</li>
          <li>Moisturize within 3 minutes of bathing</li>
          <li>Apply products from thinnest to thickest consistency</li>
        </ul>
      </div>

      <h2>Signs of a Damaged Skin Barrier</h2>
      <ul>
        <li><strong>Increased sensitivity</strong> - Products that never bothered you now sting</li>
        <li><strong>Dry, flaky patches</strong> - Especially around nose and cheeks</li>
        <li><strong>Redness and inflammation</strong> - Persistent redness that won't calm down</li>
        <li><strong>Breakouts</strong> - Acne in unusual places or more frequent than normal</li>
        <li><strong>Tightness</strong> - Skin feels tight even after moisturizing</li>
      </ul>

      <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800" alt="Comparison of damaged vs healthy skin barrier" />

      <h2>How to Repair Your Skin Barrier</h2>
      <ol>
        <li><strong>Simplify your routine</strong> - Use only gentle, hydrating products for 2-4 weeks</li>
        <li><strong>Avoid harsh ingredients</strong> - Skip exfoliants, retinols, and strong actives temporarily</li>
        <li><strong>Add barrier-repairing ingredients</strong> - Look for ceramides, niacinamide, and fatty acids</li>
        <li><strong>Hydrate consistently</strong> - Use a good moisturizer morning and night</li>
        <li><strong>Protect with SPF</strong> - Sun damage significantly weakens the barrier</li>
      </ol>

      <blockquote>
        "Healthy skin barrier = happy skin. It takes about 14-28 days to repair a damaged barrier with consistent care."
      </blockquote>

      <div class="warning">
        <strong>⚠️ Avoid these common mistakes:</strong> Over-exfoliating, skipping SPF, using harsh soaps, hot water, and physical scrubs
      </div>

      <h2>Recommended Barrier-Supporting Ingredients</h2>
      <ul>
        <li><strong>Ceramides</strong> - Lipids that naturally occur in skin</li>
        <li><strong>Niacinamide (Vitamin B3)</strong> - Reduces inflammation and boosts ceramide production</li>
        <li><strong>Fatty acids</strong> - Found in oils like jojoba, squalane, and shea butter</li>
        <li><strong>Panthenol (Vitamin B5)</strong> - Hydrates and soothes</li>
        <li><strong>Centella asiatica</strong> - Calming and healing properties</li>
      </ul>

      <p>Remember, repairing your skin barrier takes time and patience. Be consistent with your routine and listen to what your skin needs!</p>
    `,
    readTime: '6 min read',
    category: 'Skin Health',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    videoUrl: 'https://youtu.be/FVbTV1XyKCk?si=Tvifhdg93AgX7aTX',
  },
  {
    id: '2',
    title: 'How Stress Affects Your Skin',
    description:
      'Discover the connection between stress and common skin issues like acne, eczema, and premature aging.',
    content: `
      <div class="info">
        <strong>🧠 Did You Know?</strong> The skin is often called the "second brain" because it contains its own nervous system!
      </div>

      <h2>The Mind-Skin Connection</h2>
      <p>Stress triggers a cascade of hormonal changes that directly impact your skin health. When you're stressed, your body produces cortisol, which can increase oil production by up to 30% and trigger inflammation throughout the body.</p>

      <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800" alt="Person meditating to reduce stress" />

      <div class="tip">
        <strong>🧘 Quick Stress Relief:</strong> Take 5 deep breaths right now. Inhale for 4 seconds, hold for 4, exhale for 6. Feel the difference?
      </div>

      <h2>Common Stress-Related Skin Issues</h2>

      <h3>Acne Breakouts</h3>
      <p>Stress increases cortisol levels, which stimulates oil production and can lead to clogged pores and breakouts. Stress acne often appears on the chin, jawline, and forehead.</p>

      <h3>Eczema and Psoriasis Flares</h3>
      <p>Stress weakens the skin barrier and triggers inflammatory responses, making these conditions significantly worse. Up to 70% of people with eczema report stress as a trigger.</p>

      <h3>Premature Aging</h3>
      <p>Chronic stress accelerates the breakdown of collagen and elastin by increasing cortisol levels. This leads to fine lines, wrinkles, and loss of firmness.</p>

      <h3>Dryness and Dehydration</h3>
      <p>Stress affects the skin's ability to retain moisture by disrupting the skin barrier function, leaving it dry, tight, and compromised.</p>

      <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800" alt="Woman practicing mindfulness in nature" />

      <h2>Stress Management Techniques for Better Skin</h2>
      <ol>
        <li><strong>Mindfulness Meditation</strong> - Just 10 minutes daily can significantly reduce cortisol levels</li>
        <li><strong>Regular Exercise</strong> - Improves circulation and reduces stress hormones (aim for 30 mins, 5x/week)</li>
        <li><strong>Quality Sleep</strong> - 7-9 hours allows skin to repair and regenerate (cell turnover peaks at night!)</li>
        <li><strong>Deep Breathing Exercises</strong> - Activates the parasympathetic nervous system instantly</li>
        <li><strong>Skincare as Self-Care</strong> - Turn your routine into a relaxing ritual, not a chore</li>
      </ol>

      <blockquote>
        "When you calm your mind, you calm your skin. Stress reduction isn't just self-care—it's essential skincare."
      </blockquote>

      <h2>Skincare Tips for Stress-Prone Skin</h2>
      <ul>
        <li>Use calming ingredients like chamomile, green tea, and centella asiatica</li>
        <li>Avoid harsh exfoliants and strong actives during high-stress periods</li>
        <li>Incorporate adaptogens like ashwagandha (orally) and reishi (topically)</li>
        <li>Keep your routine simple and consistent—don't introduce new products when stressed</li>
        <li>Use lukewarm water and gentle, fragrance-free products</li>
      </ul>

      <div class="warning">
        <strong>⚠️ Warning Signs:</strong> If stress is causing severe skin issues or affecting your daily life, consider speaking with a dermatologist or mental health professional.
      </div>

      <p><strong>Remember:</strong> Managing stress is just as important as your skincare products for achieving healthy, glowing skin!</p>
    `,
    readTime: '7 min read',
    category: 'Lifestyle & Stress',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
  },
  {
    id: '3',
    title: 'Essential Nutrients for Glowing Skin',
    description:
      'The vitamins and minerals your skin needs to look its best, plus the best food sources.',
    content: `
      <div class="info">
        <strong>🥑 Beauty from Within:</strong> What you eat shows up on your face! Your skin is the last organ to receive nutrients but the first to show deficiencies.
      </div>

      <h2>Essential Nutrients for Healthy Skin</h2>
      <p>Your diet directly affects your skin's appearance and health. Here are the key nutrients your skin needs to thrive:</p>

      <img src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800" alt="Colorful array of nutrient-rich foods including berries, avocados, and salmon" />

      <div class="tip">
        <strong>🥗 The Rainbow Rule:</strong> Eat a variety of colorful fruits and vegetables daily. Each color provides different antioxidants for your skin!
      </div>

      <h3>🍊 Vitamin C</h3>
      <p><strong>Essential for collagen production</strong>, vitamin C helps keep skin firm, bright, and youthful. It also protects against UV damage and reduces hyperpigmentation.</p>
      <p><strong>Best sources:</strong> Citrus fruits (oranges, grapefruit), berries (strawberries, blueberries), bell peppers (especially red), kiwis, broccoli, and tomatoes.</p>

      <h3>🥑 Vitamin E</h3>
      <p><strong>A powerful antioxidant</strong> that protects skin from free radical damage caused by UV rays and pollution. It works synergistically with vitamin C.</p>
      <p><strong>Best sources:</strong> Nuts (almonds, hazelnuts), seeds (sunflower seeds), avocados, spinach, and wheat germ oil.</p>

      <h3>🐟 Omega-3 Fatty Acids</h3>
      <p><strong>Maintains skin's lipid barrier</strong>, keeping it hydrated, supple, and plump. Omega-3s also reduce inflammation and can help with acne and eczema.</p>
      <p><strong>Best sources:</strong> Fatty fish (salmon, mackerel, sardines), walnuts, flaxseeds, chia seeds, and hemp seeds.</p>

      <h3>🦪 Zinc</h3>
      <p><strong>Supports skin healing, reduces inflammation</strong>, and helps control oil production. Zinc is crucial for wound healing and acne management.</p>
      <p><strong>Best sources:</strong> Oysters (highest source), pumpkin seeds, lentils, chickpeas, cashews, and grass-fed beef.</p>

      <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800" alt="Bowl of fresh salmon salad with vegetables" />

      <h2>Best Foods for Glowing Skin</h2>
      <ul>
        <li><strong>Fatty fish</strong> (salmon, mackerel, sardines) - Rich in omega-3s and protein</li>
        <li><strong>Avocados</strong> - Packed with healthy fats and vitamin E</li>
        <li><strong>Walnuts</strong> - Contain omega-3s and omega-6s</li>
        <li><strong>Sunflower seeds</strong> - Excellent source of vitamin E</li>
        <li><strong>Sweet potatoes</strong> - High in beta-carotene (natural SPF)</li>
        <li><strong>Bell peppers</strong> - More vitamin C than oranges!</li>
        <li><strong>Broccoli</strong> - Contains zinc, vitamin A, and vitamin C</li>
        <li><strong>Tomatoes</strong> - Rich in lycopene (protects from sun damage)</li>
        <li><strong>Green tea</strong> - Powerful anti-inflammatory antioxidants</li>
        <li><strong>Dark chocolate</strong> (70%+ cocoa) - Flavonols improve skin hydration and circulation</li>
      </ul>

      <blockquote>
        "Let food be thy medicine and medicine be thy food." — Hippocrates. Your skin will thank you for every healthy bite!
      </blockquote>

      <div class="warning">
        <strong>⚠️ Foods to Limit:</strong> High-sugar foods, processed snacks, excessive dairy, and alcohol can trigger inflammation and breakouts in many people.
      </div>

      <h2>Sample Daily Meal Plan for Glowing Skin</h2>
      <ul>
        <li><strong>Breakfast:</strong> Oatmeal with berries, walnuts, and a drizzle of honey</li>
        <li><strong>Morning Snack:</strong> Green tea + an apple</li>
        <li><strong>Lunch:</strong> Salmon salad with leafy greens, avocado, and pumpkin seeds</li>
        <li><strong>Afternoon Snack:</strong> Carrot sticks with hummus</li>
        <li><strong>Dinner:</strong> Grilled chicken with sweet potato and steamed broccoli</li>
        <li><strong>Evening:</strong> Dark chocolate square and herbal tea</li>
      </ul>

      <p><strong>Pro tip:</strong> Drink at least 8 glasses of water daily! Hydration is essential for nutrient transport and skin plumpness. Give these dietary changes 4-6 weeks to see noticeable improvements in your skin.</p>
    `,
    readTime: '8 min read',
    category: 'Nutrition & Diet',
    imageUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800',
    videoUrl: 'https://youtu.be/fk-VTgdPqAA?si=-eu0rQR68430jOu6',
  },
  {
    id: '4',
    title: 'Morning Skincare Routine Guide',
    description:
      'Step-by-step guide to building an effective morning skincare routine for all skin types.',
    content: `
      <div class="info">
        <strong>🌅 Morning vs. Night:</strong> Your morning routine is about PROTECTION. Your night routine is about REPAIR. Don't confuse them!
      </div>

      <h2>The Perfect Morning Skincare Routine</h2>
      <p>A consistent morning routine sets the tone for your skin's health throughout the day. It should take 5-10 minutes max. Here's your step-by-step guide:</p>

      <img src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800" alt="Morning skincare products arranged beautifully" />

      <div class="tip">
        <strong>⏰ Time-Saving Tip:</strong> Apply products while skin is still slightly damp from previous step for better absorption!
      </div>

      <h2>Step 1: Gentle Cleanser</h2>
      <p>Start with a gentle, hydrating cleanser to remove overnight buildup (sweat, oil, and dead skin cells) without stripping your skin. In the morning, you don't need a heavy-duty cleanse—just enough to refresh.</p>
      <p><strong>Pro tip:</strong> If you have very dry or sensitive skin, you can simply rinse with lukewarm water in the morning.</p>

      <h2>Step 2: Vitamin C Serum</h2>
      <p>Apply a vitamin C serum to protect against environmental damage (pollution, blue light, UV rays) and brighten your complexion. Vitamin C is an antioxidant that neutralizes free radicals and boosts collagen production.</p>
      <p><strong>Pro tip:</strong> Store vitamin C in a cool, dark place to prevent oxidation. It should be pale yellow—if it's dark orange/brown, it's expired!</p>

      <h2>Step 3: Moisturizer</h2>
      <p>Use a lightweight moisturizer to hydrate and prepare your skin for sunscreen. Even oily skin needs moisturizer! Dehydrated skin produces more oil to compensate.</p>

      <h2>Step 4: Sunscreen (SPF 30+)</h2>
      <p><strong>The most important step!</strong> Apply broad-spectrum sunscreen as the final step in your morning routine. Use 2 finger-lengths for face and neck. Reapply every 2 hours if you're outside!</p>

      <blockquote>
        "The best anti-aging product you can use is sunscreen. Period. Nothing else comes close." — Every dermatologist ever
      </blockquote>

      <img src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800" alt="Applying sunscreen to face" />

      <h2>Product Recommendations by Skin Type</h2>

      <h3>Oily Skin</h3>
      <ul>
        <li><strong>Cleanser:</strong> Gel-based or foaming cleanser with salicylic acid</li>
        <li><strong>Moisturizer:</strong> Oil-free, gel, or water-based moisturizer</li>
        <li><strong>Sunscreen:</strong> Matte-finish, oil-free SPF</li>
      </ul>

      <h3>Dry Skin</h3>
      <ul>
        <li><strong>Cleanser:</strong> Cream or milk cleanser (no foaming)</li>
        <li><strong>Moisturizer:</strong> Rich, cream-based moisturizer with ceramides</li>
        <li><strong>Sunscreen:</strong> Hydrating, dewy-finish SPF</li>
      </ul>

      <h3>Sensitive Skin</h3>
      <ul>
        <li><strong>Cleanser:</strong> Fragrance-free, non-foaming cleanser</li>
        <li><strong>Moisturizer:</strong> Minimal ingredients, soothing formula</li>
        <li><strong>Sunscreen:</strong> Mineral sunscreen (zinc oxide or titanium dioxide)</li>
      </ul>

      <h3>Combination Skin</h3>
      <ul>
        <li><strong>Cleanser:</strong> Balanced gel-cream cleanser</li>
        <li><strong>Moisturizer:</strong> Lightweight lotion (apply less on oily T-zone)</li>
        <li><strong>Sunscreen:</strong> Lightweight, non-comedogenic SPF</li>
      </ul>

      <div class="warning">
        <strong>⚠️ Common Morning Mistakes:</strong> Skipping sunscreen, over-cleansing, applying products in wrong order, using night treatments in AM, and not waiting between layers.
      </div>

      <h2>Morning Routine Order (Quick Reference)</h2>
      <ol>
        <li>Cleanser (30 seconds)</li>
        <li>Vitamin C serum (wait 1 minute)</li>
        <li>Moisturizer (apply immediately after serum)</li>
        <li>Sunscreen (wait 2 minutes before makeup)</li>
      </ol>

      <p><strong>Remember:</strong> Patch test new products and introduce them one at a time, waiting 2 weeks between additions. Consistency beats intensity—a simple routine done daily is better than an elaborate routine done occasionally!</p>
    `,
    readTime: '6 min read',
    category: 'Skin Health',
    imageUrl: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800',
  },
  {
    id: '5',
    title: 'Managing Stress Through Mindfulness',
    description: 'Simple mindfulness techniques to reduce stress and improve your skin health.',
    content: `
      <div class="info">
        <strong>🧘 Science Says:</strong> Regular mindfulness practice can reduce cortisol levels by up to 30% and improve inflammatory skin conditions!
      </div>

      <h2>Mindfulness for Better Skin Health</h2>
      <p>The mind-skin connection is powerful and scientifically proven. Practicing mindfulness can significantly reduce stress-related skin issues like acne, eczema, psoriasis, and premature aging.</p>

      <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800" alt="Person meditating in peaceful setting" />

      <div class="tip">
        <strong>🌿 1-Minute Mindfulness:</strong> Right now, notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Instant grounding!
      </div>

      <h2>Simple Mindfulness Techniques for Busy People</h2>

      <h3>Deep Breathing (2 minutes)</h3>
      <p>Take 5 minutes each morning for deep, intentional breathing. Try box breathing: inhale 4 sec → hold 4 sec → exhale 4 sec → hold 4 sec. Repeat 5-10 times.</p>

      <h3>Body Scan (5 minutes)</h3>
      <p>Notice tension in your face, jaw, neck, and shoulders—areas where we hold stress. Consciously relax these areas. Your skin will thank you!</p>

      <h3>Mindful Skincare (3 minutes)</h3>
      <p>Turn your routine into a meditation by focusing entirely on sensations: the texture of products, temperature of water, scent (if any), and the feeling of massage.</p>

      <h3>Gratitude Practice (2 minutes)</h3>
      <p>Start your day by listing 3 things you're grateful for. Gratitude shifts your nervous system from stress response to relaxation response.</p>

      <img src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800" alt="Peaceful morning meditation by window" />

      <h2>5-Minute Morning Mindfulness Routine</h2>
      <ol>
        <li><strong>Sit comfortably</strong> with spine straight but not rigid. Close your eyes (1 minute)</li>
        <li><strong>Take 10 deep breaths</strong>, focusing completely on the sensation of breathing (2 minutes)</li>
        <li><strong>Scan your body</strong> from head to toe, actively releasing tension (1 minute)</li>
        <li><strong>Set an intention</strong> for your day (e.g., "Today I will be kind to myself and my skin") (1 minute)</li>
      </ol>

      <blockquote>
        "Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom." — Viktor Frankl
      </blockquote>

      <h2>Mindfulness for Common Skin Concerns</h2>

      <h3>For Acne</h3>
      <p>Practice self-compassion. Stress picking makes acne worse. When you feel the urge to pick, pause and take 3 deep breaths instead.</p>

      <h3>For Eczema/Psoriasis</h3>
      <p>Use guided imagery. Visualize your skin healing and calming with each breath. Studies show this reduces itch-scratch cycles.</p>

      <h3>For Premature Aging</h3>
      <p>Facial massage while applying products. It reduces tension, increases blood flow, and stimulates collagen production.</p>

      <h3>For Rosacea</h3>
      <p>Cool water rinses while practicing deep breathing. Heat and stress are common triggers—mindfulness helps manage both.</p>

      <div class="warning">
        <strong>⚠️ When to Seek Help:</strong> If stress is overwhelming and affecting your daily life, relationships, or mental health, please speak with a healthcare professional. Mindfulness complements but doesn't replace medical treatment.
      </div>

      <h2>Apps to Help You Get Started</h2>
      <ul>
        <li><strong>Headspace</strong> - Great for beginners (10-day free course)</li>
        <li><strong>Calm</strong> - Excellent guided meditations and sleep stories</li>
        <li><strong>Insight Timer</strong> - Completely free with thousands of meditations</li>
        <li><strong>Breathwrk</strong> - Simple breathing exercises for stress relief</li>
      </ul>

      <p><strong>Consistency is key.</strong> Even 5 minutes of mindfulness daily can make a significant difference in your stress levels and skin health within 2-4 weeks. Start small, be patient, and watch both your mind and skin transform!</p>
    `,
    readTime: '7 min read',
    category: 'Lifestyle & Stress',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
  },
  {
    id: '6',
    title: 'Anti-Inflammatory Diet for Skin',
    description: 'Foods that fight inflammation and promote clear, radiant, youthful skin.',
    content: `
      <div class="info">
        <strong>🔥 Did You Know?</strong> Chronic inflammation is linked to acne, eczema, psoriasis, rosacea, and premature aging. Fighting inflammation helps all of them!
      </div>

      <h2>The Anti-Inflammatory Diet for Clear Skin</h2>
      <p>Chronic inflammation can lead to various skin issues including acne, eczema, premature aging, and even skin cancer. An anti-inflammatory diet is one of the most powerful tools for achieving clear, glowing skin.</p>

      <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800" alt="Colorful anti-inflammatory foods including berries, leafy greens, and salmon" />

      <div class="tip">
        <strong>🥬 The Anti-Inflammatory Plate:</strong> Fill 1/2 plate with colorful vegetables, 1/4 with lean protein, 1/4 with complex carbs, and add healthy fats!
      </div>

      <h2>Foods to Eat (The Good Guys)</h2>
      <ul>
        <li><strong>Leafy greens</strong> (spinach, kale, collards) - Rich in antioxidants and vitamins</li>
        <li><strong>Fatty fish</strong> (salmon, sardines, mackerel) - Omega-3s reduce inflammation</li>
        <li><strong>Berries</strong> (blueberries, strawberries, raspberries) - Packed with anthocyanins</li>
        <li><strong>Nuts and seeds</strong> (walnuts, almonds, chia seeds, flaxseeds) - Healthy fats and vitamin E</li>
        <li><strong>Turmeric and ginger</strong> - Powerful natural anti-inflammatories</li>
        <li><strong>Green tea</strong> - EGCG antioxidants reduce redness and inflammation</li>
        <li><strong>Olive oil</strong> - Oleocanthal has similar effects to ibuprofen</li>
        <li><strong>Tomatoes</strong> - Lycopene reduces inflammation and UV damage</li>
        <li><strong>Broccoli</strong> - Sulforaphane fights inflammation at cellular level</li>
        <li><strong>Mushrooms</strong> - Contain ergothioneine, a powerful antioxidant</li>
      </ul>

      <h2>Foods to Avoid (The Bad Guys)</h2>
      <ul>
        <li><strong>Processed foods</strong> - Chips, crackers, frozen meals, fast food</li>
        <li><strong>Added sugar and artificial sweeteners</strong> - Soda, candy, pastries, sweetened yogurt</li>
        <li><strong>Refined carbohydrates</strong> - White bread, white rice, pasta, bagels</li>
        <li><strong>Trans fats</strong> - Fried foods, margarine, commercial baked goods</li>
        <li><strong>Excessive alcohol</strong> - More than 1 drink/day for women, 2 for men</li>
        <li><strong>Processed meats</strong> - Bacon, sausage, deli meats, hot dogs</li>
        <li><strong>Vegetable oils</strong> - Soybean, corn, and sunflower oils (high in omega-6s)</li>
      </ul>

      <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800" alt="Healthy bowl of quinoa salad with vegetables" />

      <blockquote>
        "Every time you eat or drink, you are either feeding disease or fighting it." — Dr. Mark Hyman
      </blockquote>

      <h2>1-Day Anti-Inflammatory Skin Diet Meal Plan</h2>

      <h3>Breakfast (7:00 AM)</h3>
      <p>Oatmeal topped with fresh blueberries, walnuts, and a drizzle of honey. Green tea on the side.</p>

      <h3>Morning Snack (10:00 AM)</h3>
      <p>Green apple with 1 tablespoon almond butter.</p>

      <h3>Lunch (1:00 PM)</h3>
      <p>Quinoa bowl with roasted salmon, spinach, cherry tomatoes, cucumber, avocado, and a lemon-tahini dressing.</p>

      <h3>Afternoon Snack (4:00 PM)</h3>
      <p>Carrot and celery sticks with hummus. Turmeric-ginger tea.</p>

      <h3>Dinner (7:00 PM)</h3>
      <p>Grilled chicken or tofu with roasted sweet potato, broccoli, and cauliflower. Season with turmeric, black pepper, and garlic.</p>

      <h3>Evening (9:00 PM)</h3>
      <p>Small piece of dark chocolate (70%+ cocoa) and chamomile tea.</p>

      <div class="warning">
        <strong>⚠️ Food Sensitivities:</strong> Some people find dairy, gluten, or nightshades (tomatoes, peppers, eggplant) trigger their skin. Try an elimination diet for 4 weeks to identify your personal triggers.
      </div>

      <h2>Anti-Inflammatory Lifestyle Tips</h2>
      <ul>
        <li><strong>Stay hydrated</strong> - Water flushes out inflammatory toxins (aim for 8-10 glasses/day)</li>
        <li><strong>Get enough sleep</strong> - Inflammation increases when you're sleep-deprived</li>
        <li><strong>Exercise regularly</strong> - Moderate exercise reduces inflammatory markers</li>
        <li><strong>Manage stress</strong> - Chronic stress keeps your body in inflammatory state</li>
        <li><strong>Limit alcohol</strong> - Even moderate drinking increases inflammation</li>
        <li><strong>Avoid smoking</strong> - It's one of the most inflammatory things you can do</li>
      </ul>

      <p><strong>Patience is essential!</strong> Give an anti-inflammatory diet 4-6 weeks to see noticeable improvements in your skin. Track your progress with photos and a food/symptom diary. Many people report clearer skin, reduced redness, less puffiness, and a natural glow within 8 weeks.</p>

      <p><strong>Remember:</strong> An 80/20 approach works best—eat anti-inflammatory foods 80% of the time and allow flexibility 20% of the time. Perfect isn't sustainable, but progress is!</p>
    `,
    readTime: '9 min read',
    category: 'Nutrition & Diet',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    videoUrl: 'https://youtu.be/FVbTV1XyKCk?si=Tvifhdg93AgX7aTX',
  },
];
