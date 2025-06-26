# 🎓 Sistema de Horários Escolares

Sistema completo para geração automática de horários escolares com controle avançado de dobradinhas e prevenção de conflitos pedagógicos.

## 🚀 Funcionalidades

### ✅ Principais
- **Cadastro de Matérias**: Defina disciplinas e carga horária semanal
- **Cadastro de Professores**: Configure disponibilidade de dias e horários por professor
- **Cadastro de Turmas**: Associe matérias com quantidade de aulas específicas
- **Geração Automática**: Algoritmo inteligente que distribui aulas respeitando restrições
- **Controle de Dobradinhas**: Configure quais matérias podem ter aulas consecutivas
- **Detecção de Conflitos**: Identifica e reporta problemas na grade gerada
- **Exportação**: Salve dados em formato JSON para backup

### 🛡️ Controles de Segurança Pedagógica

#### **Sistema de Dobradinhas Configurável**
- ✅ **Máximo 2 aulas seguidas** da mesma matéria (dobradinha)
- ✅ **Configuração por turma** - cada turma define suas regras
- ✅ **Seleção de matérias** - escolha quais disciplinas podem ter dobradinha
- ✅ **Prevenção automática** de 3+ aulas consecutivas (erro pedagógico)

#### **Distribuição Inteligente**
- ✅ **Máximo 2 aulas por dia** da mesma matéria
- ✅ **Distribuição aleatória** para variedade na grade
- ✅ **Priorização de dobradinhas** quando permitido e viável
- ✅ **Validação rigorosa** contra violações de regras

## 🔧 Como Usar

### 1. **Cadastrar Dados Base**
```
1️⃣ Matérias → Adicione disciplinas (ex: Matemática, Português)
2️⃣ Professores → Configure disponibilidade e matérias lecionadas  
3️⃣ Turmas → Defina quantidade de aulas por matéria
```

### 2. **Configurar Dobradinhas**
```
📋 Na criação/edição de turma:
   ☑️ Permitir aulas em sequência (dobradinha)
   
   Se SIM, selecione matérias permitidas:
   ☐ Matemática     ☑️ Português
   ☐ História       ☑️ Ciências
   ☐ Geografia      ☐ Inglês
```

### 3. **Gerar Horários**
```
🎯 Clique em "Gerar Horários"
📊 Visualize a grade gerada
⚠️ Verifique conflitos reportados
📥 Exporte para backup se satisfeito
```

## 🐛 Correção Implementada

### **Problema Identificado:**
❌ Algoritmo anterior gerava 4-5 aulas consecutivas da mesma matéria
❌ Não respeitava limites pedagógicos realistas

### **Solução Implementada:**
✅ **Controle rigoroso**: Máximo 2 aulas seguidas (dobradinha)
✅ **Validação automática**: Detecta e previne violações
✅ **Interface configurável**: Usuário define regras por turma
✅ **Distribuição melhorada**: Evita sobrecarga em um dia

## 📊 Dados de Teste

Para testar o sistema, use os dados fornecidos:

### 📚 **Matérias**
- Matemática - 5 aulas/semana
- Português - 4 aulas/semana  
- História - 3 aulas/semana
- Geografia - 3 aulas/semana
- Ciências - 4 aulas/semana
- Inglês - 2 aulas/semana
- Educação Física - 2 aulas/semana
- Arte - 2 aulas/semana

### 👨‍🏫 **Professores**
```
Prof. Ana Silva      → Matemática, Ciências
Prof. Carlos Santos  → Português, História  
Prof. Maria Oliveira → Geografia, História
Prof. João Costa     → Inglês, Arte
Prof. Lucia Ferreira → Educação Física, Ciências
```

### 🏫 **Turmas Sugeridas**
```
6º Ano A - Todas as matérias configuradas
7º Ano B - Variação nas quantidades
8º Ano C - Teste de limites
```

## ⚙️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Estilo**: Tailwind CSS
- **Ícones**: Lucide React
- **Armazenamento**: LocalStorage
- **Algoritmo**: Geração com backtracking e validação

## 🎯 Resultados Esperados

### **Antes da Correção:**
```
❌ Segunda-feira: 4 aulas de Português seguidas (8h, 9h, 10h, 11h)
❌ Terça-feira: 4 aulas de Matemática seguidas (7h, 8h, 9h, 10h)
```

### **Depois da Correção:**
```
✅ Segunda-feira: Dobradinha de Português (8h, 9h) + outras matérias
✅ Terça-feira: Dobradinha de Matemática (7h, 8h) + distribuição equilibrada
✅ Distribuição ao longo da semana respeitando limites pedagógicos
```

## 🚀 Para Usar no Bolt.new

1. **Acesse**: https://bolt.new
2. **Importe do GitHub**: 
   ```
   https://github.com/klaus-deor/horario-escolar-lite
   ```
3. **Instale dependências**: `npm install`
4. **Execute**: `npm run dev`
5. **Teste**: Use os dados fictícios fornecidos

## 🔍 Validações Implementadas

- ✅ **Máximo 2 aulas consecutivas** da mesma matéria
- ✅ **Máximo 2 aulas por dia** da mesma matéria
- ✅ **Respeito à disponibilidade** de professores
- ✅ **Prevenção de conflitos** de horário
- ✅ **Configuração flexível** por turma e matéria

## 📝 Licença

Projeto open source para uso educacional e institucional.

---

**🎓 Sistema desenvolvido para otimizar a criação de grades de horários escolares respeitando as melhores práticas pedagógicas!**