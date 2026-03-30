import { NODE_MAP } from '../src/services/nodeMap.js'

let passed = 0
let failed = 0

function test(description, actual, expected) {
  if (actual === expected) {
    console.log(`  ✓  ${description}`)
    passed++
  } else {
    console.log(`  ✗  ${description}`)
    console.log(`     esperat: ${expected}`)
    console.log(`     rebut:   ${actual}`)
    failed++
  }
}

console.log('\n--- NODE 0 ---')
test(
  'node_0 sempre va a node_1',
  NODE_MAP.node_0.next([]),
  'node_1'
)

console.log('\n--- NODE 1 ---')
const n1_safe = [
  { question_id: 'q1_fear',     choice: 'no' },
  { question_id: 'q1_coerce',   choice: 'no' },
  { question_id: 'q1_violence', choice: 'no' },
]
test(
  'node_1 sense risc → node_2',
  NODE_MAP.node_1.next(n1_safe),
  'node_2'
)

const n1_fear = [
  { question_id: 'q1_fear',     choice: 'yes' },
  { question_id: 'q1_coerce',   choice: 'no' },
  { question_id: 'q1_violence', choice: 'no' },
]
test(
  'node_1 amb por → route_d',
  NODE_MAP.node_1.next(n1_fear),
  'route_d'
)

const n1_violence = [
  { question_id: 'q1_fear',     choice: 'no' },
  { question_id: 'q1_coerce',   choice: 'no' },
  { question_id: 'q1_violence', choice: 'yes' },
]
test(
  'node_1 amb violència → route_d',
  NODE_MAP.node_1.next(n1_violence),
  'route_d'
)

console.log('\n--- NODE 2 ---')
const n2_ok = [
  { question_id: 'q2_activation', score: 4 },
  { question_id: 'q2_margin',     choice: 'yes' },
]
test(
  'node_2 activació 4 + marge sí → node_3a',
  NODE_MAP.node_2.next(n2_ok),
  'node_3a'
)

const n2_high = [
  { question_id: 'q2_activation', score: 9 },
  { question_id: 'q2_margin',     choice: 'yes' },
]
test(
  'node_2 activació 9 → route_b',
  NODE_MAP.node_2.next(n2_high),
  'route_b'
)

const n2_nomargin = [
  { question_id: 'q2_activation', score: 3 },
  { question_id: 'q2_margin',     choice: 'no' },
]
test(
  'node_2 sense marge → route_b',
  NODE_MAP.node_2.next(n2_nomargin),
  'route_b'
)

console.log('\n--- NODE 4 ---')
test(
  'node_4 confirma → node_5',
  NODE_MAP.node_4.next([{ question_id: 'q4_confirm', choice: 'yes' }]),
  'node_5'
)
test(
  'node_4 revisa → node_3a',
  NODE_MAP.node_4.next([{ question_id: 'q4_confirm', choice: 'no' }]),
  'node_3a'
)

console.log('\n--- NODE 5 ---')
test(
  'node_5 confiança alta → node_6',
  NODE_MAP.node_5.next([{ question_id: 'q5_confidence', choice: 'alta' }]),
  'node_6'
)
test(
  'node_5 confiança mitjana → node_6',
  NODE_MAP.node_5.next([{ question_id: 'q5_confidence', choice: 'mitjana' }]),
  'node_6'
)
test(
  'node_5 baixa + tema → node_3a',
  NODE_MAP.node_5.next([
    { question_id: 'q5_confidence', choice: 'baixa' },
    { question_id: 'q5_what_fails', choice: 'tema' },
  ]),
  'node_3a'
)
test(
  'node_5 baixa + fase → node_3b',
  NODE_MAP.node_5.next([
    { question_id: 'q5_confidence', choice: 'baixa' },
    { question_id: 'q5_what_fails', choice: 'fase' },
  ]),
  'node_3b'
)

console.log('\n--- NODE 7 ---')
test(
  'node_7 ha ajudat → node_8',
  NODE_MAP.node_7.next([
    { question_id: 'q7_helped',     choice: 'si' },
    { question_id: 'q7_tension',    choice: 'no' },
    { question_id: 'q7_activation', score: 2 },
  ]),
  'node_8'
)
test(
  'node_7 tensió alta → node_2',
  NODE_MAP.node_7.next([
    { question_id: 'q7_helped',     choice: 'si' },
    { question_id: 'q7_tension',    choice: 'yes' },
    { question_id: 'q7_activation', score: 3 },
  ]),
  'node_2'
)
test(
  'node_7 activació ≥ 8 → node_2',
  NODE_MAP.node_7.next([
    { question_id: 'q7_helped',     choice: 'si' },
    { question_id: 'q7_tension',    choice: 'no' },
    { question_id: 'q7_activation', score: 8 },
  ]),
  'node_2'
)
test(
  'node_7 parcialment → node_6',
  NODE_MAP.node_7.next([
    { question_id: 'q7_helped',     choice: 'parcialment' },
    { question_id: 'q7_tension',    choice: 'no' },
    { question_id: 'q7_activation', score: 2 },
  ]),
  'node_6'
)

console.log('\n--- NODE 8 ---')
test(
  'node_8 sempre va a done',
  NODE_MAP.node_8.next([]),
  'done'
)

console.log(`\n${'─'.repeat(35)}`)
console.log(`  ${passed} passats   ${failed} fallats`)
console.log(`${'─'.repeat(35)}\n`)

if (failed > 0) process.exit(1)