export const NODE_MAP = {

  node_0: {
    questions: [
      { id: 'q0_lang', type: 'choice',
        options: ['ca', 'es', 'en'] }
    ],
    next: () => 'node_1'
  },

  node_1: {
    questions: [
      { id: 'q1_fear',     type: 'yesno' },
      { id: 'q1_coerce',   type: 'yesno' },
      { id: 'q1_violence', type: 'yesno' }
    ],
    next: (answers) =>
      answers.some(a => a.choice === 'yes')
        ? 'route_d'
        : 'node_2'
  },

  node_2: {
    questions: [
      { id: 'q2_activation', type: 'scale', min: 0, max: 10 },
      { id: 'q2_margin',     type: 'yesno' }
    ],
    next: (answers) => {
      const act = answers.find(
        a => a.question_id === 'q2_activation'
      )?.score ?? 0
      const margin = answers.find(
        a => a.question_id === 'q2_margin'
      )?.choice
      return (act >= 8 || margin === 'no')
        ? 'route_b'
        : 'node_3a'
    }
  },
  // ... node_3a, node_3a1, node_3b, node_4–8 a continuació
    node_3a: {
    questions: [
      { id: 'q3a_01', type: 'scale', min: 1, max: 5 },
      { id: 'q3a_02', type: 'scale', min: 1, max: 5 },
      // ... fins q3a_16 (barrejades per evitar biaix)
    ],
    next: (answers, triageResult) =>
      triageResult.primary_factor
        ? 'node_3b'
        : 'node_3a1'  // factor poc clar → afinament
  },

  node_3a1: {  // opcional, s'activa si no hi ha factor clar
    questions: [
      { id: 'q3a1_mobiles',  type: 'scale', min: 1, max: 5 },
      { id: 'q3a1_consum',   type: 'scale', min: 1, max: 5 },
      // ... subtemes contextuals
    ],
    next: () => 'node_3b'
  },

  node_3b: {
    questions: [
      { id: 'q3b_phase',   type: 'choice',
        options: ['latent','obert','empitjora','encallat'] },
      { id: 'q3b_pattern', type: 'choice',
        options: ['insisteix_evita','escalada','deixa_passar',
                  'repeticio','costa_parlar'] },
      { id: 'q3b_freq',    type: 'choice',
        options: ['puntual','recurrent','cronic'] },
      { id: 'q3b_will',    type: 'choice',
        options: ['si','no','no_ho_se'] }
    ],
    next: () => 'node_4'
  },
   node_4: {   // resum + confirmació
    questions: [
      { id: 'q4_confirm', type: 'confirm' }
    ],
    next: (answers) =>
      answers[0].choice === 'yes' ? 'node_5' : 'node_3a'
  },

  node_5: {   // nivell de confiança
    questions: [
      { id: 'q5_confidence', type: 'choice',
        options: ['alta','mitjana','baixa'] },
      { id: 'q5_what_fails', type: 'choice',
        options: ['tema','fase','patro','frequencia'],
        conditional: (answers) =>
          answers.find(a=>a.question_id==='q5_confidence')
            ?.choice === 'baixa'
      }
    ],
    next: (answers) => {
      const conf = answers.find(
        a => a.question_id === 'q5_confidence'
      )?.choice
      if (conf === 'baixa') {
        const fails = answers.find(
          a => a.question_id === 'q5_what_fails'
        )?.choice
        return ['tema'].includes(fails) ? 'node_3a' : 'node_3b'
      }
      return 'node_6'
    }
  },

  node_6: {   // proposta orientativa
    questions: [
      { id: 'q6_need', type: 'choice',
        options: ['entendre','preparar','passos','ajuda_externa'] }
    ],
    next: () => 'node_7'  // proposta calculada pel proposalService
  },

  node_7: {   // check-in
    questions: [
      { id: 'q7_helped',   type: 'choice',
        options: ['si','parcialment','no'] },
      { id: 'q7_tension',  type: 'yesno' },
      { id: 'q7_activation', type: 'scale', min: 0, max: 10 }
    ],
    next: (answers) => {
      const helped = answers.find(
        a => a.question_id === 'q7_helped'
      )?.choice
      const tension = answers.find(
        a => a.question_id === 'q7_tension'
      )?.choice
      const act = answers.find(
        a => a.question_id === 'q7_activation'
      )?.score ?? 0
      if (tension === 'yes' || act >= 8) return 'node_2'
      if (helped !== 'si') return 'node_6'
      return 'node_8'
    }
  },

  node_8: {   // tancament
    questions: [
      { id: 'q8_helped',  type: 'choice',
        options: ['opcio_a','opcio_b','opcio_c'] },
      { id: 'q8_signal',  type: 'choice',
        options: ['opcio_a','opcio_b','opcio_c'] },
      { id: 'q8_habit',   type: 'choice',
        options: ['opcio_a','opcio_b','opcio_c'] }
    ],
    next: () => 'done'
  }
}
