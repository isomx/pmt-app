/**
 * Based on chain-function by jquense
 * Github: https://github.com/jquense/chain-function
 **/


export const chain = () => {
  const len = arguments.length
  let args = [];

  for (let i = 0; i < len; i++) {
    args[i] = arguments[i]
  }
  console.log('argument = ', arguments);
  args = args.filter((fn) => { return fn != null })
  if (args.length === 0) return undefined
  if (args.length === 1) return args[0]

  return args.reduce(function(current, next){
    return function chainedFunction() {
      console.log('current = ', current);
      console.log('next = ', next);
      current.apply(this, arguments);
      next.apply(this, arguments);
    };
  });
}