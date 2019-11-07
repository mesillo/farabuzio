# CATLITTER

## Una interfaccia per facilitare l'uso delle versione open di localstack.

CatLitter è il maldestro e grossolano tentativo di sopperire alla mancanza di una SandBox su AWS durante lo svolgimento delle mie mansioni lavorative.
Essendo pensato per essere una sanbox a uso personale non è assolutamente adatto alla produzione e, tantomeno, da considerarsi completo.
Attualmente il bisogno a cui tento di rispondere è quello di far girare delle Lambda come consumer, e producer (ma questo è triviale), di streams kinesis.
I servizi considerati sono, dunque: Lambda, Kinesis sterams e CloudWatch. Altre cose per il momento non sono state testate.
Originariamente pensato come una semplice webapp node in grado di caricare files, nel Docker, e eseguire comandi awslocal sta velocemente degenerato in una serie di magheggi orrendi per ottenere delle esecuzioni locali di componenti node che dovrano girare su AWS.
Scrivere delle documentazione decente e dei test per il momento è fuori dai miei obbiettivi.
