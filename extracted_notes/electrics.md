# ELECTRICS

## 1. Basic DC Theory

### BASIC UNITS

· Electrical units

- Coulomb (C). A coulomb is a quantity of electrons. Specifically, it's 6.25 x 10¹⁸
- Ampere (A). Used to measure current. 1 Amp is equal to 1 Coulomb per second.
  - Measured with ammeters
- Measured with ammeters
- Voltage (V). The magnitude of electromotive force that will cause one Coulomb to charge to move from one point to another
  - Measured with voltmeters
- Measured with voltmeters
- Ohm (Ω). Used to measure resistance. By definition, one Ohm is the resistance that will allow one ampere of current to flow in a circuit to which one volt is applied.

### DC PRINCIPLES

| · Ohm's LawVoltage = Current x Resistance (V = I x R) |  |
| --- | --- |

· 2 types of circuits

- Series. When loads are placed in series, current remains constant and voltage drops after each load.
- Parallel. When loads are placed in parallel, current is distributed (Kirchoff's Law), and voltage remains constant.



· Temperature coefficient

- Conductors can be classified depending on their reaction to temperature changes.
- Positive Temperature Coefficient (+) involves that, with increasing temperature (+), resistance increases (+) and viceversa
- Negative Temperature Coefficient involves that, with increasing temperature, resistance decreases and viceversa

· Power

- Power is the amount of work done in a specific time. In other words, it's the rate of doing work.
- Power = VI = RI² = V²/R
  - V = Voltage
  - I = Current
  - R = Resistance
- V = Voltage
- I = Current
- R = Resistance

## 2. Aircraft wiring, protection and control

### AIRCRAFT CIRCUITS

· Typical aircraft configurations

- Dipole or two-wire system. Each load is connected to wires at both sides (before and after the load)
- Unipole, single pole or Earth-return system. Each load is only connected at one side to the circuit. On the other side, the circuit will have a ground wire (typically linked to the own aircraft's structure). It's characteristics are:
  - The resistance of the Earth return part is negligible
  - Aircraft weight reduced (less wiring)
  - It allows for a simpler and less bulky wiring system
  - Less faults, and less troubleshooting required
  - However, bad metallic connections can cause faults
- The resistance of the Earth return part is negligible
- Aircraft weight reduced (less wiring)
- It allows for a simpler and less bulky wiring system
- Less faults, and less troubleshooting required
- However, bad metallic connections can cause faults



### CIRCUIT FAULTS

· Typical electrical circuit faults:

- Short circuits. A low resistance path is accidentally created. Current flows unrestrictedly through it, overheating the wires and, eventually, causing a fire.
- Open circuits. If the conductor is broken, current won't flow.

### PROTECTION DEVICES

· Fuses: They act as a weak link, designed to break if there's a current overload.

- They usually consist of a strip of metal which melts and open the circuits when the current exceeds the fuse rating.
- Fuses have a current limitation, which is how much current is allowed through it before it breaks.
- If a fuse breaks, you must replace it once. If it breaks again, there's an underlying electronic malfunction, so leave the system disconnected and report it when back on the ground.
- If an aircraft uses fuses, it's mandatory to take 10% or 3 fuses per current limitation on board (the greatest) .

· Current limiters

- Similar to fuses, however, they are usually a bit more resistant, and they stand a considerable current overload.
- Once a current limiter is opened, it must be replaced

· Circuit breakers. Designed to automatically open the circuit in case of overload. They can be reset, no need for replacement.

- 
  - Usually, 2 types of circuits:Non trip-free: they can be physically held against the fault.Trip-free: the circuit will remain open regardless of the position of the circuit breaker knob, and it will only allow current flow once the circuit has cooled down.
  - Non trip-free: they can be physically held against the fault.
  - Trip-free: the circuit will remain open regardless of the position of the circuit breaker knob, and it will only allow current flow once the circuit has cooled down.
  - Circuit breakers shouldn't be reset more than once during flight.
- Usually, 2 types of circuits:
  - Non trip-free: they can be physically held against the fault.
  - Trip-free: the circuit will remain open regardless of the position of the circuit breaker knob, and it will only allow current flow once the circuit has cooled down.
- Non trip-free: they can be physically held against the fault.
- Trip-free: the circuit will remain open regardless of the position of the circuit breaker knob, and it will only allow current flow once the circuit has cooled down.
- Circuit breakers shouldn't be reset more than once during flight.

### STATIC ELECTRICITY

· Static electricity

- It's a build-up of electric charge on the surface of the objects
- Static electricity is created by the friction of air with an aircraft in flight.
- Static electricity is generated easier when the air is dry.

· Interference with radio equipment

- Static electricity is almost never an issue. The most noticeable effect for pilots is interference with radio equipment.
- When charged air molecules ionize, they turn into plasma and produce a visible glow known as St Elmo's Fire.

### BONDING

· A technique consisting on connecting together all the metallic parts of the aircraft, building a no-resistance path for the current. This allows for:

- Safe transmission of the current generated by lightning strikes
- Equalization of static charges which may be different on several parts of the aircraft
- Reduction of interference caused by static discharges
- Prevention of electrical shock to personnel
- Prevention of static discharges

### HAZARDS

· Lightning strikes

- Because aircraft structure is bonded, the current received travels through the structure to the static wicks, where it's discharged without harming any passengers
- However, they can result in some components being magnetized, affecting compass accuracy.

· Screening

- A technique consisting on placing a protected material inside a metallic shield.
- If an electrical discharge gets to the metal cage, the material inside will remain safe because the cage absorbs the electricity.

· Risk mitigation

- Aircraft are provided with earthing strips or semi-conductive tyres to equalize the whole aircraft to earth potential.
  - As soon as the aircraft lands, therefore, any build-up of static current will be discharged.
  - This is critical to avoid undesired discharges while refueling.
- As soon as the aircraft lands, therefore, any build-up of static current will be discharged.
- This is critical to avoid undesired discharges while refueling.
- Aircraft are also equipped with discharge pins, which are sharp conductors where lightning strikes are driven to get out of the aircraft.
  - Note: electricity tends to exit a body through its sharpest points. That's why antennas are sharp
- Note: electricity tends to exit a body through its sharpest points. That's why antennas are sharp

## 3. Batteries

### CELLS

· A cell is a series of negative and positive plates immersed in a liquid known as an electrolyte.

- They are built to convert chemical energy into electrical energy.
- Chemical reactions that occur inside cells cause electric current to flow.

· Types of cells

- Primary. Non rechargeable. Use and throw.
- Secondary. Rechargeable (e.g, lead-acid, nickel-cadmium, lithium)

### TERMINOLOGY

· Current vs electron flow

- Conventional Current Flow assumes that current flows out of the positive terminal, through the circuit and into the negative terminal of the source. This was the convention chosen during the discovery of electricity, but time proved them to be wrong.
- Electron flow is what actually happens and electrons flow out of the negative terminal, through the circuit and into the positive terminal of the source.
- In fact, it makes no difference which way the electrons are flowing as long as it is used consistently.

| Anode | · Electrode through which conventional current enters into an electrical device (conventional flow). A common mnemonic is ACID, for "anode current into device"· Electrons are actually flowing out of the anode of a galvanic cell (electron actual flow) |
| --- | --- |
| Cathode | · Electrode from which conventional current leaves an electrical device (conventional flow). A common mnemonic is CCD, for "cathode, current departs".· Electrons are actually flowing into a device's cathode (electron actual flow) |
| Oxidation | The process of losing electrons |
| Reduction | The process of gaining electrons |



### BATTERIES USED IN AVIATION

· In aviation, we use rechargeable batteries, which are made of secondary cells. The most typical batteries are the lead-acid battery, the nickel-cadmium and the lithium battery, used in modern aircraft.

· The Lead-Acid battery

- Usually made of 6 or 12 cells
- Each cell's voltage is 2.2V charged and 1.8 discharged.
  - A charged 12 cell battery would provide a 26.4 voltage
- A charged 12 cell battery would provide a 26.4 voltage
- Anode: Spongy lead
- Cathode: Lead Peroxide
- Electrolyte: Sulfuric acid.
- Specific Gravity: 1'27 (charged) and 1.1 (discharged)
- Neutralizing agent: Bicarbonate of Soda

· Nickel-Cadmium battery

- Usually made of 20-22 cells
- Each cell's voltage is 1.2V charged and 1.1 discharged
- Anode: Cadmium
- Cathode: Nickel Oxide
- Electrolyte: Potassium Hydroxide.
- SG is always 1.26
- Neutralizing agent: Boric Acid
- Advantages of nickel-cadmium batteries
  - More stable voltage until sudden drop
  - Wider temperature range
  - Less weight
  - Quicker to charge
- More stable voltage until sudden drop
- Wider temperature range
- Less weight
- Quicker to charge
- Disadvantages
  - Memory effect (reduces its capacity if not topped-off during recharge)
  - Risk of thermal runaway
- Memory effect (reduces its capacity if not topped-off during recharge)
- Risk of thermal runaway

· Lithium ion batteries (used in B787 and A350)

- Anode and cathode store lithium
- Electrolyte carries positively charged lithium ions from the anode to the cathode and viceversa through a separator
- Advantages
  - High energy density
  - No memory effect
  - Low self-discharge
- High energy density
- No memory effect
- Low self-discharge
- Disadvantages
  - Hazardous since electrolyte is flammable
- Hazardous since electrolyte is flammable

· Threats associated with aircraft batteries

- Thermal Runaway. When battery temperature increases, resistance decreases, risking overheat and fire. Some batteries are fitted with sensors to prevent this
- Battery leakage. Loss of electrolyte will prevent the battery from proper functioning
- Internal failures or short circuits

· Capacity of batteries

- Expressed in Ampere hours (Ah)
- A 40Ah battery can provide a 40 amps current during an hour, or a 80 Amp current during half an hour, for example.

· Charging methods: 2 main ways

- Constant Voltage: a voltage bigger than the battery's is connected. The charge rate is proportional to the voltage difference.
- Pulse Charging: A DC current is supplied until battery is fully charged; then, pulse DC to keep it topped up.

· Connection of several batteries

- In series: Voltage is added
- In parallel: Current is added

### EMERGENCY USE

· If power supply is lost, batteries must be able to provide:

- Main batteries must supply the aircraft for 30 minutes
- Emergency lighting batteries must last for at least 10 minutes.

## 4. Electromagnetism

### MAGNETISM

· Magnetism is one aspect of the combined electromagnetic force. It refers to physical phenomena arising from the force caused by magnets, objects that produce fields that attract or repel other objects.

| · Magnetic field flows from north to south magnetic poles.We use magnetic field lines as a tool to represent magnetic fields.Any magnet will tend to align itself with that magnetic field. |  |
| --- | --- |

· Classification of materials according to magnetism

- Permanent magnets. They remain magnetized without the influence of another magnetic field.
- Non permanent magnets. They only show magnetic properties if they are within the influence of another magnetic field.
- Non magnetic materials. They never show magnetic properties.

· Hard vs soft iron

- Hard iron is difficult to magnetize, but it will retain its magnetism unless subjected to a strong demagnetizing force
- Soft iron is easily magnetized, but it also easily loses its magnetism when not subjected to a magnetizing force. Temporary magnets are soft irons.

### DOMAINS

| · Domains are tiny permanent magnets inside a magnetic material in which the magnetization is in a uniform direction. They are caused by electron spin.· When some material is magnetized, all its domains get aligned. This is known as saturation. |  |
| --- | --- |

### MAGNETIZING AND DEMAGNETIZING MAGNETS

· Ways to magnetize a magnet:

- Hammering inside a magnetic field

· Ways to demagnetize a magnet:

- Heat to a temperature known as Curie point
- Hammer it
- Degaussing it with an alternating magnetic field

### 

### ELECTROMAGNETISM

| · Magnetism and electricity are linked to each other. Electromagnetism is the term we use to refer to how these forces act together.Electric current generates a magnetic fieldThrough magnetic fields, we can generate electric current· Electrical current generates a circular magnetic field around it.The direction of the field can be determined with the right hand grasp rule.Thumb points to the direction of current flowThe other 4 fingers are aligned with the direction of the magnetic fieldThe intensity of the magnetic field is proportional to the current flowing through the wire and gets smaller with distance |  |
| --- | --- |

## 5. DC Generators

### ELECTROMAGNETIC INDUCTION

· Electromagnetic induction refers to the fact that we can generate current flow by spinning a conductor inside a magnetic field (or spinning the magnetic field hitting a conductor). In fact, this is what Faraday's Law is about.

· Faraday's Law

- Principle: the change of magnetic field "in contact" with a conductor will create and induced current proportional to the rate of change of the magnetic field.
- Note: it's not the magnetic field itself creating the current, but the CHANGE of it. If there is no change, there's no current.
- Factors affecting the generated current
  - Strength of the magnetic field
  - Speed of conductor relative to field
  - Angle at which the conductor cuts the field
  - Length of the conductor
- Strength of the magnetic field
- Speed of conductor relative to field
- Angle at which the conductor cuts the field
- Length of the conductor

### ELECTRICAL GENERATORS

· Electrical generators

- There are 2 types of generators. DC Generators and AC Generators.
- Both convert mechanical power to electrical power.
  - In life, mechanical power can come from water currents, windmills or a nuclear reactor generating water vapour. In aviation, mechanical power is provided by the engine.
- In life, mechanical power can come from water currents, windmills or a nuclear reactor generating water vapour. In aviation, mechanical power is provided by the engine.
- AC-Generators:
  - An electromagnet (which is a magnetic field created by an electrical current) is powered. This is achieved by using the aircraft's battery until the generator can supply itself.
  - Spinning wires are driven by the engine and connected to static brushes that transmit the generated current.
  - Generators are fitted with a weak point called quill drive. They are meant to break if generator seizes. Also known as shear neck.
  - Output is alternating current.
  - [VIDEO] Working principle of AC Generators
- An electromagnet (which is a magnetic field created by an electrical current) is powered. This is achieved by using the aircraft's battery until the generator can supply itself.
- Spinning wires are driven by the engine and connected to static brushes that transmit the generated current.
- Generators are fitted with a weak point called quill drive. They are meant to break if generator seizes. Also known as shear neck.
- Output is alternating current.
- [VIDEO] Working principle of AC Generators
- DC-Generators
  - Similar to AC generators, but they also have:A commutator used to turn AC into DC, apart of serving as a means of collecting the brushes to a rotating loop.Brushes used to connect the generated current to an external circuit.
  - A commutator used to turn AC into DC, apart of serving as a means of collecting the brushes to a rotating loop.
  - Brushes used to connect the generated current to an external circuit.
- Similar to AC generators, but they also have:
  - A commutator used to turn AC into DC, apart of serving as a means of collecting the brushes to a rotating loop.
  - Brushes used to connect the generated current to an external circuit.
- A commutator used to turn AC into DC, apart of serving as a means of collecting the brushes to a rotating loop.
- Brushes used to connect the generated current to an external circuit.
- Voltage output can be regulated through the strength of the magnetic field. Because it's an electromagnet, the strength of the magnetic field can be varied with the electrical current. Therefore, the own generator can "stabilize" and manage itself to provide a constant output.



Image source: instrumentationtools.com

## 6. DC Motors

### INTRODUCTION

· Motors are very similar to generators. However, motors convert electricity into motion.

- Because they are so similar, some airplanes use machines designed to operate in either role

### HOW DC MOTORS WORK

· Principle

- The electrical current generates a magnetic field that repels the outer and permanent magnetic field, generating movement.
- The output torque and speed depends on the electrical input and the design of the motor.



· Components

- Stator. Stationary part of the motor, made of two magnets.
- Armature. Rotational part. Contains coils that act as electromagnets, a commutator and a shaft
  - The commutator allows each armature coil to be energized in a turn at the correct time
  - The commutator is connected to static brushes that link the motor to the electrical wiring
- The commutator allows each armature coil to be energized in a turn at the correct time
- The commutator is connected to static brushes that link the motor to the electrical wiring

### TYPES OF MOTORS

· Types of motors

- Series motors. They provide high torque at low speeds, but efficiency decreases with speed.
  - Used for starter motors
- Used for starter motors
- Shunt motors. Low starting torque. Used when fairly constant speed is required (for example, fuel pumps)
- Compound motors. Combine shunt and parallel construction, merging its characteristic (good startup torque, and constant speed after startup)

· Starter motors

- Used in small and medium sized aircraft
- Components
  - Starter DC motor
  - Clutch. Used to engage or disengage the starter motor from the gearbox
  - Starter Jaw or Gearbox. Connecting the clutch to the engine gearbox
- Starter DC motor
- Clutch. Used to engage or disengage the starter motor from the gearbox
- Starter Jaw or Gearbox. Connecting the clutch to the engine gearbox

·  Actuators

- Motors that use a step-down gearbox output low RPM but high torque.
- Types:
  - Linear
  - Rotary
- Linear
- Rotary
- Provided with limit switches that will stop them when they reach their max range.

## 7. Alternators

### INTRODUCTION

· The DC alternator

- The DC alternator is basically an AC alternator to which we add a rectifier.
- Therefore, we are going to study the AC alternator first before talking about current rectification.

· Comparison between DC generators and DC alternators

- In a generator, the current is generated in the rotor. In an alternator, current is generated in the stator.
  - Because current now comes from a static component, there's no longer need for a commutator or static brushes (they are a source of sparks)
- Because current now comes from a static component, there's no longer need for a commutator or static brushes (they are a source of sparks)
- In alternators, the magnet is rotating and connected to the engine.
- Alternators are lighter and more efficient
- Alternators initially produce AC, which is easier to work with, transform and use to our advantage, rather than DC.

### SINGLE PHASE AC ALTERNATOR

| · Simple single phase AC alternatorStator or armature. Where current is inducedRotor or magnet. Driven by engine via a belt. Provides the magnetic field.· Disadvantages: because it's alternating current, if we connect this to a battery, it will charge and discharge the battery alternatively. We still need to the develop this a bit more. |  |
| --- | --- |

· Rectifier

- Used to turn AC into DC.
- Uses diodes, which are electronic devices that only allow current to flow one way.
- A single rectifier (single diode) can achieve half-wave rectification.
- Four diodes are required for full-wave rectification



· Further smoothing can be achieved through a capacitor or by using a three phase alternator.

### THREE PHASE AC ALTERNATOR



· The overall output (green) is not strictly DC, but it's pretty close to it and it's valid to supply current to aircraft batteries.

### VOLTAGE REGULATION

· Voltage regulation

- To be honest, the rotor is not a hard iron. It's an electromagnet
- The alternator itself supplies current to the electromagnet. The more current supplied, the stronger the magnetic field will be, and the bigger the voltage that the generated current will have.
- Therefore, the alternator itself can regulate the voltage as required.

### FREQUENCY WILD DC ALTERNATOR

· In normal alternators, the output frequency depends on the RPM of the rotor, the number of pairs of coils and the number of magnets that are spinning.

· Some aircraft have a frequency wild DC alternator, producing 14 volt 60 amp current regardless of engine RPM.

## 8. Monitoring on small aircraft

### OPERATION

· Typical electrical switches found on aircraft

- Battery switch.
- Alternator switch.
- Circuit breakers.
- Other devices (radio, lights, etc)

· Before startup, battery feeds the electrical system of the aircraft, and, therefore, gets discharged.

- After starting up, the engine drives the alternator through a belt and current can be produced. This current will recharge the battery and keep it 100%.
- If the alternator fails in flight, the battery should provide at least 30 minutes of operation. Reduce the load by turning off non-essential consumers to maximize battery uptime.

### MONITORING

· System monitoring: 2 types of instruments

- 0 Left Ammeter or Loadmeter. Goes from 0 to max amps. However, if alternator is providing 4 amps, but battery is using 15, battery will be discharging without noticing.
- Centre Reading Ammeter. Goes from negative to positive, measuring net current so we can deduce if battery is getting charged or discharged.



## 9. Inductance and capacitance

### INDUCTANCE

· Inductance is the property of a conductor to oppose a change in current flowing through it.

- The magnetic field strength depends on the magnitude of the current, and follows any changes in current.
- Any change in magnetic field through a circuit induces an electromotive force (EMF) (voltage) in the conductors, a process known as electromagnetic induction.
- This induced voltage created by the changing current has the effect of opposing the change in current. This voltage is called back EMF



· Note that, when current is constant, no EMF is created and inductance is not present.

· Measured in Henry (L)

- 1 L = Induction of 1 volt when the current changes at a rate of 1 ampere second
- Usually microhenry and milihenry are used
- The energy is stored as a magnetic field

· Inductors are devices designed to have a specific value of inductance.

- Their characteristics can be increased by increasing the number of coils or inserting a permeable material into the coil.

### CAPACITANCE

· Capacitance

- Is the property that enables a conductor to store energy in an electrostatic field.
- Measured in Farad (C)
- 1 C = Capacitance that will store a charge of 1 coulomb when an EMF of 1 volt is applied
- Usually microfarad and picofarad are used
- C = Q (Coulombs) / V

· Capacitors

- Consist on 2 metal plates separated by an insulator called a dielectric
- Variable capacitors have multiple plates moved by a shaft



· Charging of capacitors

- When a capacitor is not charged, the same number of free electrons exists on both plates.
- By applying DC, a capacitor will become charged to a potential equal and opposite to the supply's potential.

· Discharging of capacitors

- Happens when removed from the supply and connected to a resistor

· Factors affecting capacitance

- Area of the plates and type of dielectric
- Spacing between the places

## 10. Basic AC theory

### INTRODUCTION

· Advantages of AC

- AC generators are simpler and lighter than DC generators
- AC motors are simpler, more robust and efficient than DC motors
- Easier to work with: voltage, for example, can be changed easily through a transformer, and high voltages are more suitable for large-distance transmission
  - Transformers don't work with DC
- Transformers don't work with DC
- AC can be easily rectified to DC using a rectifier.
  - Note. DC can be turned into AC using a static inverter, but it's much less efficient.
- Note. DC can be turned into AC using a static inverter, but it's much less efficient.
- Information can be encoded using AC

| · TerminologyCycle. A complete revolution of the rotor / generator (360º)Period. Time taken to complete one cycleFrequency. Number of periods completed per second.Phase. An angular notation of the sine wavePeak Value. Maximum value at the peakPeak to Peak Value. 2 x peak valueAverage voltage value = 0.637 x peakRoot Mean Squared Value. Also known as effective or heating value of AC, it's equivalent to a DC voltage that would provide the same amount of heat generation. RMS = 0.707 x peakFor example, AC current with peaks of 169 volts has a RMS of 120 volts. This means that the heating of the voltage is equivalent to a 120 volt DC current. |  |
| --- | --- |

### PHASE RELATIONSHIP

| · PhaseIf current and voltage are together, and they reach the peaks at the same time, they are said to be in phase.When waves are not coincident, they are said to have a phase difference.Phase differences are expressed in degrees (0-360º), since one cycle corresponds to 360º. Sometimes, radians are used. |  |
| --- | --- |

### EFFECT OF AC ON A PURELY RESISTIVE CIRCUIT

| · Effect of AC on a purely resistive circuitVoltage and current are in phasePower is always positive |  |
| --- | --- |

### EFFECT OF AC ON A PURELY CAPACITIVE CIRCUIT

| · Effect of AC on a purely capacitive circuitCurrent leads the voltage by 90ºPower varies (positive to negative)No power as a result, average power = 0 |  |
| --- | --- |

· Capacitive reactance (Xc)

- Opposition to current flow because capacitor is in constant opposition to battery
- Inversely proportional to capacitance and frequency
- If frequency increases, Xc decreases, so current increases

### EFFECT OF AC ON A PURELY INDUCTIVE CIRCUIT

| · Effect of AC on a purely inductive circuitVoltage leads the current by 90ºPower varies (positive to negative)No power as a result, average power = 0 |  |
| --- | --- |

· Inductive Reactance (XL)

- Opposition to changes in current flow
- Proportional to the inductance of the inductor and frequency of supply voltage

### SUMMARY

· Use the mnemonic CIVIL

- In a capacitive (C) circuit, current (I) leads voltage (V) -- CIV part of the word --
- In an inductive circuit (L), voltage (V) leads current (I) -- VIL part of the word --

### IMPEDANCE

· Impedance (Z)

- Is the total opposition to current flow in an AC circuit.

· Resonant circuit

- Happens when Xc = XL. They cancel each other out, minimum resistance occurs.

### POWER DEFINITIONS

· Types

- True or Effective. It's the power consumed by the resistive component (W)
- Reactive. It's the power consumed by the reactive component (VAR)
- Apparent. The voltage and current applied to a circuit (VA)
- Power factor = True power / Apparent power

## 11. Transformers

### INTRODUCTION

· Transformers are devices designed to change the voltage of AC current

- Transformers are rated in Volt Amperes
- Note that they don't work with DC currents; only AC!!
- They are very efficient (80% - 96%)

| · Vs / Ns = Vp / NpVs: Voltage inNs: N of coils of the "in" partVp: Voltage outNp: N of coils of the "out" part |  |
| --- | --- |

### CLASSIFICATION

· Classification according to voltage change

- Step up transformers. They have more coils in the output than in the input, therefore, increasing voltage.
- Step down transformers. They have less coils in the output than in the input. Voltage decreases.

· Types

- Voltage transformers
  - Also known as isolation transformers because primary circuit is isolated from the secondary
  - 3 phase transformers follow the same principle but using 3 arms. Used in Transformer-Rectifier Units (TRUs)
- Also known as isolation transformers because primary circuit is isolated from the secondary
- 3 phase transformers follow the same principle but using 3 arms. Used in Transformer-Rectifier Units (TRUs)
- Auto-transformers
  - No isolation exists between primary and secondary windings.
  - If autotransformers can be adjusted, then they are known as a variac
- No isolation exists between primary and secondary windings.
- If autotransformers can be adjusted, then they are known as a variac
- Current transformers
  - Primary circuit is a supply feeder cable instead of a winding
  - The alternating magnetic field induces current into a secondary coil
- Primary circuit is a supply feeder cable instead of a winding
- The alternating magnetic field induces current into a secondary coil

### TRANSFORMER RECTIFIER UNITS

· Transformer Rectifier Units

- They are a combination of transformers + rectifiers
- If they overheat, a warning is annunciated to the pilot
- If reverse current flows, the TRU is disconnected automatically

· Inverters. They turn DC into AC. 2 types:

- Rotary inverters
  - DC motors + AC Generators linked in a common shaft
  - Not efficient (50%) since power is lost as back EMF and friction
- DC motors + AC Generators linked in a common shaft
- Not efficient (50%) since power is lost as back EMF and friction
- Static inverters
  - A bit more efficient (70%), but only suitable for small loads.
- A bit more efficient (70%), but only suitable for small loads.
- If using multiple inverters, they must be installed must be installed in series.

## 12. Three-phase machines

### INTRODUCTION TO THREE PHASE ELECTRICS

· Three-phase generators generate three separate voltages of the same amplitude and frequency, but separated 120º in phase.

· Advantages of 3 phase systems

- Higher efficiency
- For same size or weight, three phase machines produce higher outputs than single phase machines
- A three-phase machine can be smaller than a single-phase machine for the same output
- Power delivered has a more constant value, which allows for better torque and less vibration from three-phase motors.
- Fewer conductors required
- The same source can be used for single phase and 3 phase systems

· Three phase alternators consist on several parts:

- Rotor (carrying a magnet, typically an electromagnet, driven by the aircraft engine)
- Stator (it has three sets of coils or windings)



### CONFIGURATION OF THREE-PHASE CIRCUITS

| · Three-phase circuits can be configured in either delta or wye configurationWye stands for "Y" and it's also called star configurationDelta comes from the Greek “Δ” |  |
| --- | --- |

· Star connection

- It has a neutral return line. Therefore, it needs 4 cables.
- The potential difference between each phase and the neutral point is called phase voltage or line to neutral voltage, and typically expressed as Vp
- The potential difference across two lines is called the line voltage or line to line voltage, typically expressed as VL
- Line voltage = √3 x Phase Voltage
- Line current = Phase current

· Delta connection

- It needs 3 cables
- Line voltage = Phase voltage
- Line current = √3 x Phase current

### VOLTAGE AND FREQUENCY OF AC GENERATORS

· Voltage is controlled by adjusting the field excitation of the AC alternator by means of a voltage regulator

· Frequency is controlled by the rotational speed and the number of poles

- Frequency = RPM * Number of pairs of poles per phase / 60

### PHASE ROTATION

· Phase rotation. The power supplies must have a positive phase sequence. Otherwise, motors can run in the wrong direction.

### TYPES OF AC GENERATORS

· 2 types:

- Brush generators. Typically found on turboprop aircraft for frequency-wild generation
- Brushless generators. Typically found on large jet aircraft for constant frequency outputs
  - They require less maintenance and are more reliable
  - No brush wear problems associated
  - Driven by the aircraft by a Constant Speed Drive Unit, aiming for an output of 400 Hz
  - In aircraft where CSDU and generator are combined, they form a unit known as the Integrated Drive Generator (IDG)
- They require less maintenance and are more reliable
- No brush wear problems associated
- Driven by the aircraft by a Constant Speed Drive Unit, aiming for an output of 400 Hz
- In aircraft where CSDU and generator are combined, they form a unit known as the Integrated Drive Generator (IDG)

### THREE-PHASE MACHINES FOUND ON MODERN AIRCRAFT - POWER GENERATION

· Constant Speed Drive Unit (CSDU)

- Mechanical device positioned between engine and brushless generators, controlled via a speed governor (a swashplate)
- Turns at constant 8000 RPM, aiming at an output current of 400 Hz
- Temperature is monitored.
- If disconnected, it can only be reset on the ground with engines shut down
- If speed changes, it's automatically disconnected to prevent damage to the electrical system
- Protected by a Quill Drive that will break before any major damage is caused
- Air cooled

· Integrated Drive Generator

- Combination of generator + CSDU
- Reduces weight, vibrations and space needed
- Oil cooled

· Variable Speed Constant Frequency generators

- Uses a frequency wild generator producing 3 phase AC
- The AC is rectified to DC and inverted back to AC at a fixed frequency
- No mechanical gear or hydraulics, low power loss, maintenance free

### THREE-PHASE MACHINES FOUND ON MODERN AIRCRAFT - POWER CONSUMERS

· Induction (Squirrel Cage) motor

- Used to drive fuel pumps, actuators and air conditioning
- Self-starting
- When the stator receives a three-phase current, it produces a rotating magnetic field with a frequency proportional to the frequency of the supply
- Rotor is a cylindrical laminated iron core with a number of aluminum bars evenly spaced around its circumference
- An outside rotating current induces an EMF in the Squirrel Cage (rotor) while it turns at less speed than outside magnetic field does.
- The difference between motor and rotating field is known as slip speed.
- When the rotor and the stator's magnetic field moves at the same time, there's no EMF.

· 2 phase induction motor

- Not too smooth, but by placing windings 90º apart we wan create a motor.
- Used for autopilots and servomotors.

· Split phase motor

- 2 windings: 1 resistive and 1 capacitive 90º apart
- The motor will operate as a 2 phase machine

· The synchronous motor

- Rotor is a DC powered magnet, behaving exactly like a hard iron magnet. Therefore, it tends to align itself with magnetic field around it.
- As outside magnetic field is rotated, the magnet rotates with it
- Doesn't need an electricity input (work can be achieved by a permanent magnet), but, if provided, it will be more efficient
- Needs a starter motor (usually a squirrel cage)

## 13. Practical AC supply and distribution systems

### DISADVANTAGES OF AC

· Constant Speed Units are large and expensive, not suitable for small aircraft.

- In cases where DC units are not suitable, and CSDUs are prohibitive, a frequency-wild system is used.

· In general, there are 2 ways of providing AC power:

- Frequency Wild systems
- Constant Frequency systems

### AC POWER SUPPLY - FREQUENCY WILD

· Frequency Wild System

- Used in medium turbo-prop aircraft and small piston engines

· Twin-engine frequency wild system

- Each engine is linked to an AC generator
- Output is 200V, 3 phase and varies its frequency with engine RPM

· Fault protection

- Overheat: Warning light. Pilot should switch off the generator.
- Earth-leakage and under-voltage: A warning light. Pilot must monitor the voltmeter, and, in case of earth-leakage, switch off the generator.
- Over-voltage: a sensing mechanism automatically de-excites the generator and disconnects it from bus bar. Usually it can be reset once
- Differential protection monitors line to line and line to earth faults, opening the circuit if required.

### AC POWER SUPPLY - CONSTANT FREQUENCY

· Industry standards:

- (AC) 115/200v AC, 3 phase, 400 Hz
- (DC) 28v

· 2 types of constant frequency systems:

- Split busbar systems
- Parallel systems

· Split busbar system

- Uses 115/200v 3 phase constant frequency alternators
- Not designed to run in parallel
- Power can be supplied from several sources (APU, external power, or two engine driven IDGs)
  - APU used for ground operations while engines are not running.
  - It doesn't need an IDG because it's a constant speed engine.
  - APUs are usually limited to a maximum altitude
- APU used for ground operations while engines are not running.
- It doesn't need an IDG because it's a constant speed engine.
- APUs are usually limited to a maximum altitude
- Normal operation: generators independently feed left and right sections of the electrical system.
  - System has got TRUs to supply any DC requirements (typically 28v DC)
  - If one IDG fails, the other IDG can supply the whole electrical system although it's normal to combine 1 IDG + APU in case one fails again.
- System has got TRUs to supply any DC requirements (typically 28v DC)
- If one IDG fails, the other IDG can supply the whole electrical system although it's normal to combine 1 IDG + APU in case one fails again.
- Emergency supplies
  - If both IDGs and APU fail in flight, aircraft battery can feed a static inverter that powers the AC ESS BUS, and a Ram Air Turbine (RAT) can be deployed to generate AC current.
- If both IDGs and APU fail in flight, aircraft battery can feed a static inverter that powers the AC ESS BUS, and a Ram Air Turbine (RAT) can be deployed to generate AC current.
- Regulation
  - Speed regulator makes adjustments to maintain 400 Hz
  - Voltage regulator adjusts IDGs field excitation to maintain 200 Volts
- Speed regulator makes adjustments to maintain 400 Hz
- Voltage regulator adjusts IDGs field excitation to maintain 200 Volts
- Protection
  - Some faults cause the IDGs to be disconnected automatically. Some examples are over-voltage and under-voltage, differential protection kicking in, and over or under frequency.
- Some faults cause the IDGs to be disconnected automatically. Some examples are over-voltage and under-voltage, differential protection kicking in, and over or under frequency.

· Parallel system

- Found in 3 and 4 engine jet aircraft
- Advantages of parallel systems
  - No interruptions of the electrical supply for switching
  - Large loads can be absorbed
  - Generator life is prolonged
- No interruptions of the electrical supply for switching
- Large loads can be absorbed
- Generator life is prolonged
- Disadvantages
  - Fault propagation more likely
- Fault propagation more likely

### EMERGENCY SUPPLY

· RAM Air Turbine

- Deployed if an electrical emergency generator is needed
- Uses free stream air to rotate, providing AC at 200 Volts, 3 phases and 400 Hz.

## 14. Semiconductors

· In the old days, vacuum tubes were used to control current flow. Nowadays, we tend to use semiconductors.

· Semiconductors can behave either as a conductor or as an insulator depending on some conditions.

- Examples: diodes, solid state rectifiers, integrated circuits

· Advantages of semiconductors

- Smaller, lighter and cheaper than vacuum tubes

· Disadvantages of semiconductors

- Susceptible to changes in temperature and easily damaged with high temperatures

· Doping: technique consisting on adding an impurity to a semiconductor.

- Impurities change the way semiconductors behave with currents

· Common semiconductors used in aviation

- Diode: It allows current flow in one direction only
- Zener-diode. Allows current flow in one direction or in the other if a certain voltage is exceeded. Used to regulate the output of the power supply.
- Transistors. Can act as amplifiers and switches.

## 15. Logic circuits

### INTEGRATED CIRCUITS

· Integrated circuits contain huge amounts of diodes, transistors, resistors and capacitors

- They form the basics of electronics

· Advantages

- Small
- Light
- Reliable
- Low-consuming

· Disadvantages

- Easily damaged by high currents or voltages, so they need to be protected.
- They cannot be repaired

### LOGIC GATES



Source: https://steamcommunity.com/sharedfiles/filedetails/?l=spanish&id=689782550

