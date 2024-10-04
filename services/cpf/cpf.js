export const formatCpf = (cpf) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const cpfIsValid = (cpf) => {
  const arr = cpf.split('');
  if (arr.every((digit) => digit === arr[0])) return false;
  let add = 0;
  let rev = 0;
  for (let i = 0; i < 9; i += 1) add += parseInt(cpf.charAt(i), 10) * (10 - i);
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9), 10)) return false;

  add = 0;
  for (let i = 0; i < 10; i += 1) add += parseInt(cpf.charAt(i), 10) * (11 - i);
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(10), 10)) return false;
  return true;
};

export const getCpfRegionAndUfs = (requestedCpf) => {
  const cpfDigit = Number(requestedCpf[8]);

  const regionsAndufs = [
    {
      regionNumber: 0,
      ufs: ['RS'],
    },
    {
      regionNumber: 1,
      ufs: ['DF', 'GO', 'MT', 'MS', 'TO'],
    },
    {
      regionNumber: 2,
      ufs: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR'],
    },
    {
      regionNumber: 3,
      ufs: ['CE', 'MA', 'PI'],
    },
    {
      regionNumber: 4,
      ufs: ['AL', 'PB', 'PE', 'RN'],
    },
    {
      regionNumber: 5,
      ufs: ['BA', 'SE'],
    },
    {
      regionNumber: 6,
      ufs: ['MG'],
    },
    {
      regionNumber: 7,
      ufs: ['ES', 'RJ'],
    },
    {
      regionNumber: 8,
      ufs: ['SP'],
    },
    {
      regionNumber: 9,
      ufs: ['PR', 'SC'],
    },
  ];
  return regionsAndufs[cpfDigit];
};
